import { Router } from "express";
import { container } from "../config/inversify.config";
import type { NegotiationController } from "../controllers/negotiation.controller";
import { SendMessageDto } from "../dtos/chat.dto";
import { validateDto } from "../middlewares/validation.middleware";
import { CHAT_TYPES } from "../types/chat.type";

const router = Router();
const negotiationController = container.get<NegotiationController>(CHAT_TYPES.ChatController);

// GET /api/negotiations/:id: Returns status, current price, and crop details.
router.get("/:id", (req, res) => negotiationController.getNegotiationDetails(req, res));

// GET /api/negotiations/:id/messages: Returns all messages.
router.get("/:id/messages", (req, res) => negotiationController.getMessages(req, res));

// POST /api/negotiations/:id/messages: Saves a message and triggers the AI agent.
router.post("/:id/messages", validateDto(SendMessageDto), (req, res) =>
    negotiationController.postMessage(req, res),
);

export default router;
