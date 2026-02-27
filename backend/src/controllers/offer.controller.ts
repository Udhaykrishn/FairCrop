import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages.constant";
import { STATUS_CODES } from "../constants/status-codes.constant";
import type { OfferService } from "../services/offer.service";
import { OFFERS } from "../types/offers.type";
import { BaseController } from "./base.controller";

@injectable()
export class OfferController extends BaseController {
	constructor(@inject(OFFERS.OfferService) private readonly _offerService: OfferService) {
		super();
	}

	async createOffer(req: Request, res: Response) {
		try {
			const offer = await this._offerService.createOffer(req.body);
			return this.sendSuccess(
				res,
				STATUS_CODES.CREATED,
				MESSAGES.OFFER_CREATED,
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
