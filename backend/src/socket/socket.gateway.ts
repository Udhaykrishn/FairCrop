import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { Crop } from "../models/crop.model";

// ── Singleton IO instance (accessed by the service layer) ──────────────────
let io: SocketServer;

// Maps for tracking connected sockets
// farmerId  → socketId
// buyerId   → socketId
const farmerSockets = new Map<string, string>();
const buyerSockets = new Map<string, string>();

export const initSocket = (httpServer: HttpServer): SocketServer => {
    io = new SocketServer(httpServer, {
        cors: { origin: "*", methods: ["GET", "POST", "PATCH"] },
    });

    io.on("connection", (socket: Socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // ── Registration ─────────────────────────────────────────────────────
        // Farmer joins with their farmerId
        socket.on("farmer:join", (farmerId: string) => {
            farmerSockets.set(farmerId, socket.id);
            console.log(`[Socket] Farmer ${farmerId} registered → ${socket.id}`);
        });

        // Buyer joins with their buyerId
        socket.on("buyer:join", (buyerId: string) => {
            buyerSockets.set(buyerId, socket.id);
            console.log(`[Socket] Buyer ${buyerId} registered → ${socket.id}`);
        });

        // ── Farmer responds to a price offer ──────────────────────────────────
        // Payload: { cropId, decision: "confirm" | "reject" }
        socket.on(
            "price:respond",
            async (payload: { cropId: string; decision: "confirm" | "reject" }) => {
                const { cropId, decision } = payload;

                try {
                    const crop = await Crop.findById(cropId);
                    if (!crop || !crop.pendingOffer) {
                        socket.emit("error", { message: "No pending offer found for this crop." });
                        return;
                    }

                    const { buyerId, offeredPrice } = crop.pendingOffer;

                    if (decision === "confirm") {
                        // Update crop: accept the price and mark as sold
                        crop.finalPrice = offeredPrice;
                        crop.isSold = true;
                        crop.pendingOffer = undefined;
                        await crop.save();

                        // Notify buyer: offer accepted
                        const buyerSocketId = buyerSockets.get(buyerId);
                        if (buyerSocketId) {
                            io.to(buyerSocketId).emit("price:confirmed", {
                                cropId,
                                finalPrice: offeredPrice,
                                message: "Your offer was accepted! The crop is now yours.",
                            });
                        }

                        console.log(`[Socket] Offer CONFIRMED for crop ${cropId} at ₹${offeredPrice}`);
                    } else {
                        // Clear the pending offer without updating price
                        crop.pendingOffer = undefined;
                        await crop.save();

                        // Notify buyer: offer rejected
                        const buyerSocketId = buyerSockets.get(buyerId);
                        if (buyerSocketId) {
                            io.to(buyerSocketId).emit("price:rejected", {
                                cropId,
                                message: "Your offer was rejected by the farmer.",
                            });
                        }

                        console.log(`[Socket] Offer REJECTED for crop ${cropId}`);
                    }
                } catch (err) {
                    console.error("[Socket] Error handling price:respond:", err);
                    socket.emit("error", { message: "Internal server error." });
                }
            }
        );

        // ── Cleanup on disconnect ─────────────────────────────────────────────
        socket.on("disconnect", () => {
            // Remove from both maps if found
            for (const [id, sid] of farmerSockets.entries()) {
                if (sid === socket.id) { farmerSockets.delete(id); break; }
            }
            for (const [id, sid] of buyerSockets.entries()) {
                if (sid === socket.id) { buyerSockets.delete(id); break; }
            }
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

/** Returns the live IO instance for use in services */
export const getIO = (): SocketServer => {
    if (!io) throw new Error("Socket.IO not initialised. Call initSocket() first.");
    return io;
};

/** Returns the socket ID for a registered farmer (or undefined if offline) */
export const getFarmerSocketId = (farmerId: string): string | undefined =>
    farmerSockets.get(farmerId);
