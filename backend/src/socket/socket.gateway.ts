import { Server as HttpServer } from "http";
import WebSocket, { WebSocketServer } from "ws";

let wss: WebSocketServer;

const chatRooms = new Map<string, Set<WebSocket>>();
const notificationRooms = new Map<string, Set<WebSocket>>();

export const initSocket = (httpServer: HttpServer): WebSocketServer => {
    wss = new WebSocketServer({ server: httpServer });

    wss.on("connection", (ws: WebSocket) => {
        console.log(`[Socket] New Client connected`);

        const joinedChatRooms = new Set<string>();
        const joinedNotificationRooms = new Set<string>();

        ws.on("message", async (rawMessage: string) => {
            try {
                const parsed = JSON.parse(rawMessage);
                const { type, payload } = parsed;

                switch (type) {
                    case "chat:join":
                        if (!chatRooms.has(payload)) {
                            chatRooms.set(payload, new Set());
                        }
                        chatRooms.get(payload)?.add(ws);
                        joinedChatRooms.add(payload);
                        console.log(`[Socket] Client joined chat room chat_${payload}`);
                        break;

                    case "notification:join":
                        if (!notificationRooms.has(payload)) {
                            notificationRooms.set(payload, new Set());
                        }
                        notificationRooms.get(payload)?.add(ws);
                        joinedNotificationRooms.add(payload);
                        console.log(`[Socket] Client joined notification room for user_${payload}`);
                        break;

                    case "chat:sendMessage":
                        try {
                            const { container } = await import("../config/inversify.config");
                            const { CHAT_TYPES } = await import("../types/chat.type");
                            const chatService = container.get<any>(CHAT_TYPES.ChatService);
                            await chatService.processMessage(payload);
                        } catch (err: any) {
                            console.error("[Socket] Error processing chat message:", err);
                            ws.send(JSON.stringify({ type: "error", payload: { message: err.message || "Failed to process chat message." } }));
                        }
                        break;

                    default:
                        console.log(`[Socket] Unknown event type: ${type}`);
                }
            } catch (err) {
                console.error("[Socket] Failed to parse/handle message:", err);
            }
        });

        ws.on("close", () => {
            for (const roomId of joinedChatRooms) {
                const room = chatRooms.get(roomId);
                if (room) {
                    room.delete(ws);
                    if (room.size === 0) chatRooms.delete(roomId);
                }
            }
            for (const userId of joinedNotificationRooms) {
                const room = notificationRooms.get(userId);
                if (room) {
                    room.delete(ws);
                    if (room.size === 0) notificationRooms.delete(userId);
                }
            }
            console.log(`[Socket] Client disconnected`);
        });
    });

    return wss;
};

export const getIO = (): WebSocketServer => {
    if (!wss) throw new Error("WebSocket not initialised. Call initSocket() first.");
    return wss;
};

export const emitToChatRoom = (sessionId: string, type: string, payload: any) => {
    const room = chatRooms.get(sessionId);
    if (!room) return;

    const message = JSON.stringify({ type, payload });
    room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

export const emitNotification = (userId: string, type: string, payload: any) => {
    const room = notificationRooms.get(userId);
    if (!room) {
        console.log(`[Socket] No active connection for notification to user ${userId}`);
        return;
    }

    const message = JSON.stringify({ type, payload });
    room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

