import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redis.config";
import type { SendMessageDto } from "../dtos/chat.dto";
import { CHAT_TYPES } from "../types/chat.type";
import type { AiService } from "./ai.service";
import { emitToChatRoom, emitNotification } from "../socket/socket.gateway";
import { Crop } from "../models/crop.model";
import { Offer, IOffer } from "../models/offer.model";

export interface ChatMessage {
    role: "user" | "ai";
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    sessionId: string;
    messages: ChatMessage[];
    offer_price?: number;
    counter_price?: number;
    reserve_price?: number;
    crop?: string;
    quantity?: number;
    farmer_location?: string;
    buyer_district?: string;
}

@injectable()
export class ChatService {
    private readonly SESSION_EXPIRY = 60 * 60;

    constructor(@inject(CHAT_TYPES.AiService) private _aiService: AiService) { }

    public async processMessage(
        dto: SendMessageDto,
    ): Promise<{ updatedSession: ChatSession }> {
        const sessionId = dto.sessionId || uuidv4();
        const redisKey = `chat_session:${sessionId}`;

        let sessionData: ChatSession = { sessionId, messages: [] };
        const existingSession = await redisClient.get(redisKey);

        if (existingSession) {
            sessionData = JSON.parse(existingSession);
        }

        // Fetch negotiation context from DB if not already stored in session
        // sessionId is generally passed as the cropId for initial negotiations
        if (!sessionData.crop) {
            try {
                const crop = await Crop.findById(sessionId);
                if (crop) {
                    sessionData.crop = crop.crop;
                    sessionData.quantity = crop.quantity;
                    sessionData.reserve_price = crop.reservedPrice;
                    sessionData.farmer_location = crop.location as unknown as string;

                    if (crop.pendingOffer) {
                        sessionData.offer_price = crop.pendingOffer.offeredPrice;
                    }

                    // Look for any existing offer to get buyer location context
                    const offer = (await Offer.findOne({ cropId: sessionId }).sort({
                        createdAt: -1,
                    })) as IOffer | null;
                    if (offer) {
                        sessionData.buyer_district = offer.buyer_location;
                        if (!sessionData.offer_price) sessionData.offer_price = offer.price;
                    }
                }
            } catch (err) {
                console.error("Error fetching context from models:", err);
            }
        }

        if (dto.offer_price !== undefined) {
            sessionData.offer_price = dto.offer_price;
        }

        const userMsg: ChatMessage = {
            role: "user",
            content: dto.message,
            timestamp: new Date(),
        };
        sessionData.messages.push(userMsg);

        // Format request for AI Agent as specified
        const aiRequest = {
            buyerMessage: dto.message,
            buyerDistrict: sessionData.buyer_district || "Unknown District",
            crop: sessionData.crop || "Unknown Crop",
            quantity: sessionData.quantity || 0,
            farmerLocation: sessionData.farmer_location || "Unknown Location",
            reservePrice: sessionData.reserve_price || 0,
            lastCounterPrice:
                sessionData.counter_price || sessionData.offer_price || 0,
        };

        await redisClient.setex(
            redisKey,
            this.SESSION_EXPIRY,
            JSON.stringify(sessionData),
        );

        emitToChatRoom(sessionId, "chat:message", {
            sessionId,
            message: userMsg,
            updatedSession: sessionData,
        });

        const aiResponse = await this._aiService.generateResponse(
            aiRequest,
            sessionData.messages,
        );

        try {
            if (aiResponse.decision) {
                sessionData.counter_price = aiResponse.decision.counterPrice;
            }

            const aiMsg: ChatMessage = {
                role: "ai",
                content: aiResponse.chatMessage,
                timestamp: new Date(),
            };
            sessionData.messages.push(aiMsg);

            await redisClient.setex(
                redisKey,
                this.SESSION_EXPIRY,
                JSON.stringify(sessionData),
            );

            emitToChatRoom(sessionId, "chat:message", {
                sessionId,
                message: aiMsg,
                updatedSession: sessionData,
            });

            if (aiResponse.decision) {
                const decisionStatus = aiResponse.decision.status;
                if (decisionStatus === "accepted" || decisionStatus === "rejected") {
                    const crop = await Crop.findById(sessionId);
                    if (crop && crop.pendingOffer) {
                        crop.pendingOffer.status = decisionStatus === "accepted" ? "confirmed" : "rejected";
                        if (decisionStatus === "accepted") {
                            // Find the specific offer to get the quantity being dealed
                            const offer = await Offer.findOne({
                                cropId: sessionId,
                                buyerId: crop.pendingOffer.buyerId,
                                status: "pending"
                            }).sort({ createdAt: -1 });

                            if (offer) {
                                // Subtract dealed kg from crop quantity
                                crop.quantity = Math.max(0, crop.quantity - offer.quantity);
                                crop.finalPrice = aiResponse.decision.counterPrice;

                                // Mark as sold if no quantity left
                                if (crop.quantity <= 0) {
                                    crop.isSold = true;
                                }

                                console.log(`[Deal] Updated crop ${sessionId}: ${offer.quantity}kg sold, ${crop.quantity}kg remaining`);
                            }
                        }
                        await crop.save();

                        // Update Offer status in DB
                        await Offer.findOneAndUpdate(
                            {
                                cropId: sessionId,
                                buyerId: crop.pendingOffer.buyerId,
                                status: "pending"
                            },
                            {
                                status: decisionStatus === "accepted" ? "accepted" : "rejected",
                                price: aiResponse.decision.counterPrice
                            },
                            { new: true }
                        );

                        // Notify Farmer via WebSocket
                        emitNotification(crop.farmerId, "farmer:notification", {
                            type: `OFFER_${decisionStatus.toUpperCase()}`,
                            message: `The agent has ${decisionStatus} a deal for your ${crop.crop} at ₹${aiResponse.decision.counterPrice}`,
                            data: {
                                cropId: sessionId,
                                status: decisionStatus,
                                price: aiResponse.decision.counterPrice,
                                cropName: crop.crop,
                                buyerId: crop.pendingOffer.buyerId
                            }
                        });

                        console.log(`[Notification] Sent ${decisionStatus} alert to farmer ${crop.farmerId}`);
                    }
                }
            }
        } catch (err) {
            console.error("Error processing session update in Redis:", err);
        }

        return { updatedSession: sessionData };
    }

    public async getSessionHistory(
        sessionId: string,
    ): Promise<ChatSession | null> {
        const redisKey = `chat_session:${sessionId}`;
        const existingSession = await redisClient.get(redisKey);

        return existingSession ? JSON.parse(existingSession) : null;
    }

    public async getNegotiationDetails(negotiationId: string) {
        const redisKey = `chat_session:${negotiationId}`;
        const existingSession = await redisClient.get(redisKey);

        if (existingSession) {
            const session = JSON.parse(existingSession);
            return {
                status: "active",
                currentPrice: session.offer_price,
                counterPrice: session.counter_price,
                cropDetails: {
                    crop: session.crop,
                    quantity: session.quantity,
                    location: session.farmer_location,
                },
            };
        }

        // Fallback to DB
        const offer = await Offer.findById(negotiationId).populate<{ cropId: any }>(
            "cropId",
        );
        if (offer) {
            return {
                status: offer.status,
                currentPrice: offer.price,
                cropDetails: {
                    crop: offer.cropId.crop,
                    quantity: offer.quantity,
                    location: offer.farmer_location,
                },
            };
        }

        return null;
    }
}
