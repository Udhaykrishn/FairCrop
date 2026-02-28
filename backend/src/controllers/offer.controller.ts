import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages.constant";
import { STATUS_CODES } from "../constants/status-codes.constant";
import type { OfferService } from "../services/offer.service";
import type { ChatService } from "../services/chat.service";
import { OFFERS } from "../types/offers.type";
import { CHAT_TYPES } from "../types/chat.type";
import { BaseController } from "./base.controller";

@injectable()
export class OfferController extends BaseController {
	constructor(
		@inject(OFFERS.OfferService) private readonly _offerService: OfferService,
		@inject(CHAT_TYPES.ChatService) private readonly _chatService: ChatService
	) {
		super();
	}

	async createOffer(req: Request, res: Response) {
		try {
			const offer = await this._offerService.createOffer(req.body);

			// Initialize chat asynchronously so it doesn't block the API response
			const initialMessage = `I would like to offer ₹${offer.price}/kg for ${offer.quantity} kg.`;
			this._chatService.processMessage({
				sessionId: offer._id.toString(),
				message: initialMessage,
				offer_price: offer.price
			}).catch(err => console.error("Failed to initialize chat:", err));

			return this.sendSuccess(
				res,
				STATUS_CODES.CREATED,
				MESSAGES.OFFER_CREATED,
				{
					negotiationId: offer._id,
					...offer.toObject()
				},
			);
		} catch (error: any) {
			console.error(error.message)
			return this.sendError(
				res,
				STATUS_CODES.INTERNAL_SERVER_ERROR,
				MESSAGES.INTERNAL_SERVER_ERROR,
				error.message,
			);
		}
	}

	async updateOffer(req: Request, res: Response) {
		try {
			const offer = await this._offerService.updateOffer(
				req.params.id as string,
				req.body,
			);
			return this.sendSuccess(
				res,
				STATUS_CODES.OK,
				MESSAGES.OFFER_UPDATED,
				offer,
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

	async getOffer(_req: Request, res: Response) {
		try {
			const offer = await this._offerService.getOffer();
			return this.sendSuccess(
				res,
				STATUS_CODES.OK,
				MESSAGES.OFFER_FOUND,
				offer,
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
