import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/status-codes.constant";
import { MESSAGES } from "../constants/messages.constant";
import { OfferService } from "../services/offer.service";
import { BaseController } from "./base.controller";
import { OFFERS } from "../types/offers.type";

@injectable()
export class OfferController extends BaseController {
    constructor(@inject(OFFERS.OfferService) private readonly offerService: OfferService) {
        super();
    }

    async createOffer(req: Request, res: Response) {
        try {
            const offer = await this.offerService.createOffer(req.body);
            return this.sendSuccess(res, STATUS_CODES.CREATED, MESSAGES.OFFER_CREATED, offer);
        } catch (error: any) {
            return this.sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, MESSAGES.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async updateOffer(req: Request, res: Response) {
        try {
            const offer = await this.offerService.updateOffer(req.params.id as string, req.body);
            return this.sendSuccess(res, STATUS_CODES.OK, MESSAGES.OFFER_UPDATED, offer);
        } catch (error: any) {
            return this.sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, MESSAGES.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async getOffer(req: Request, res: Response) {
        try {
            const offer = await this.offerService.getOffer();
            return this.sendSuccess(res, STATUS_CODES.OK, MESSAGES.OFFER_FOUND, offer);
        } catch (error: any) {
            return this.sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, MESSAGES.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}