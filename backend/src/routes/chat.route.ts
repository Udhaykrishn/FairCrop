import { Router } from "express";
import { container } from "../config/inversify.config";
import type { ChatController } from "../controllers/chat.controller";
import { SendMessageDto } from "../dtos/chat.dto";
import { validateDto } from "../middlewares/validation.middleware";
import { CHAT_TYPES } from "../types/chat.type";

const router = Router();
const chatController = container.get<ChatController>(CHAT_TYPES.ChatController);

router.post("/message", validateDto(SendMessageDto), (req, res) =>
	chatController.sendMessage(req, res),
);

router.get("/:sessionId", (req, res) => chatController.getHistory(req, res));

export default router;
