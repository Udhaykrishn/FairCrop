import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages.constant";
import { STATUS_CODES } from "../constants/status-codes.constant";
import type { SendMessageDto } from "../dtos/chat.dto";
import type { ChatService } from "../services/chat.service";
import { CHAT_TYPES } from "../types/chat.type";
import { BaseController } from "./base.controller";

@injectable()
export class NegotiationController extends BaseController {
    constructor(@inject(CHAT_TYPES.ChatService) private readonly _chatService: ChatService) {
        super();
    }

    public async postMessage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const dto: SendMessageDto = {
                ...req.body,
                sessionId: id as string
            };

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

    public async getMessages(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const history = await this._chatService.getSessionHistory(
                id as string,
            );

            if (!history) {
                return this.sendError(
                    res,
                    STATUS_CODES.NOT_FOUND,
                    "Negotiation history not found or expired",
                );
            }

            return this.sendSuccess(
                res,
                STATUS_CODES.OK,
                "History retrieved",
                history.messages,
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

    public async getNegotiationDetails(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const details = await this._chatService.getNegotiationDetails(id as string);

            if (!details) {
                return this.sendError(
                    res,
                    STATUS_CODES.NOT_FOUND,
                    "Negotiation not found",
                );
            }

            return this.sendSuccess(
                res,
                STATUS_CODES.OK,
                "Negotiation details retrieved",
                details,
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
