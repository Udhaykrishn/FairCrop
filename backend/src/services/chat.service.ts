import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redis.config";
import type { SendMessageDto } from "../dtos/chat.dto";
import { CHAT_TYPES } from "../types/chat.type";
import type { AiService } from "./ai.service";
import { emitToChatRoom } from "../socket/socket.gateway";

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
}

@injectable()
export class ChatService {
    private readonly SESSION_EXPIRY = 60 * 60;

    constructor(
        @inject(CHAT_TYPES.AiService) private _aiService: AiService
    ) { }

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

        // Update offer_price or counter_price if they are explicitly sent by user
        if (dto.offer_price !== undefined) {
            sessionData.offer_price = dto.offer_price;
        }
        if (dto.counter_price !== undefined) {
            sessionData.counter_price = dto.counter_price;
        }

        const userMsg: ChatMessage = {
            role: "user",
            content: dto.message,
            timestamp: new Date(),
        };
        sessionData.messages.push(userMsg);

        const aiContext = {
            offer_price: sessionData.offer_price,
            counter_price: sessionData.counter_price,
        };

        await redisClient.setex(
            redisKey,
            this.SESSION_EXPIRY,
            JSON.stringify(sessionData),
        );

        // Notify room clients about user's message
        emitToChatRoom(sessionId, "chat:message", {
            sessionId,
            message: userMsg,
            updatedSession: sessionData
        });

        const aiResponseContent = await this._aiService.generateResponse(
            dto.message,
            sessionData.messages,
            aiContext,
        );

        try {
            const match = aiResponseContent.match(
                /(?:counter_price\s*[:=]\s*|\bcounter\s*[:=]\s*)(\d+(?:\.\d+)?)/i,
            );
            if (match?.[1]) {
                sessionData.counter_price = Number(match[1]);
            }

            const aiMsg: ChatMessage = {
                role: "ai",
                content: aiResponseContent,
                timestamp: new Date(),
            };
            sessionData.messages.push(aiMsg);

            await redisClient.setex(
                redisKey,
                this.SESSION_EXPIRY,
                JSON.stringify(sessionData),
            );

            // Notify room clients about AI's message
            emitToChatRoom(sessionId, "chat:message", {
                sessionId,
                message: aiMsg,
                updatedSession: sessionData
            });
        } catch (err) {
            console.error("Error saving chat history to Redis:", err);
        }

        return { updatedSession: sessionData };
    }

    public async getSessionHistory(
        sessionId: string,
    ): Promise<ChatSession | null> {
        const redisKey = `chat_session:${sessionId}`;
        const existingSession = await redisClient.get(redisKey);

        if (existingSession) {
            return JSON.parse(existingSession);
        }

        return null;
    }
}
