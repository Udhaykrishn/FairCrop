import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages.constant";
import { STATUS_CODES } from "../constants/status-codes.constant";
import type { SendMessageDto } from "../dtos/chat.dto";
import type { ChatService } from "../services/chat.service";
import { CHAT_TYPES } from "../types/chat.type";
import { BaseController } from "./base.controller";

@injectable()
export class ChatController extends BaseController {
	constructor(@inject(CHAT_TYPES.ChatService) private readonly _chatService: ChatService) {
		super();
	}

	public async sendMessage(req: Request, res: Response) {
		try {
			const dto: SendMessageDto = req.body;

			const { updatedSession } =
				await this._chatService.processMessage(dto);

			return this.sendSuccess(
				res,
				STATUS_CODES.OK,
				"Message processed successfully",
				updatedSession,
			);
		} catch (error: any) {
			return this.sendError(
				res,
				STATUS_CODES.INTERNAL_SERVER_ERROR,
				MESSAGES.INTERNAL_SERVER_ERROR,
				error.message,
			);
		}
	}

	public async getHistory(req: Request, res: Response) {
		try {
			const { sessionId } = req.params;
			const history = await this._chatService.getSessionHistory(
				sessionId as string,
			);

			if (!history) {
				return this.sendError(
					res,
					STATUS_CODES.NOT_FOUND,
					"Chat session not found or expired",
				);
			}

			return this.sendSuccess(
				res,
				STATUS_CODES.OK,
				"History retrieved",
				history,
			);
		} catch (error: any) {
			return this.sendError(
				res,
				STATUS_CODES.INTERNAL_SERVER_ERROR,
				MESSAGES.INTERNAL_SERVER_ERROR,
				error.message,
			);
		}
	}
}
