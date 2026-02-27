import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { FarmerService } from "../services/farmer.service";
import { TYPES } from "../types/inversify.types";
import { sendResponse } from "../utils/response.util";
import { STATUS_CODES } from "../constants/status-codes.constant";
import { MESSAGES } from "../constants/messages.constant";

@injectable()
export class FarmerController {
    constructor(@inject(TYPES.FarmerService) private farmerService: FarmerService) { }

    public async createCrop(req: Request, res: Response) {
        try {
            const crop = await this.farmerService.createCrop(req.body);
            return sendResponse(res, STATUS_CODES.CREATED, true, "Crop listed successfully", crop);
        } catch (error: any) {
            return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, false, MESSAGES.INTERNAL_SERVER_ERROR, null, error.message);
        }
    }

    public async getCropsByFarmer(req: Request, res: Response) {
        try {
            const farmerId = req.params.farmerId as string;
            const crops = await this.farmerService.getCropsByFarmer(farmerId);
            return sendResponse(res, STATUS_CODES.OK, true, "Crops fetched successfully", crops);
        } catch (error: any) {
            return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, false, MESSAGES.INTERNAL_SERVER_ERROR, null, error.message);
        }
    }

    public async getAllCrops(req: Request, res: Response) {
        try {
            const crops = await this.farmerService.getAllCrops();
            return sendResponse(res, STATUS_CODES.OK, true, "All crops fetched successfully", crops);
        } catch (error: any) {
            return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, false, MESSAGES.INTERNAL_SERVER_ERROR, null, error.message);
        }
    }

    public async getFarmers(req: Request, res: Response) {
        try {
            const farmers = await this.farmerService.getFarmers();
            return sendResponse(res, STATUS_CODES.OK, true, "Farmers fetched successfully", farmers);
        } catch (error: any) {
            return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, false, MESSAGES.INTERNAL_SERVER_ERROR, null, error.message);
        }
    }

    public async updateFinalPrice(req: Request, res: Response) {
        try {
            const cropId = req.params.cropId as string;
            const { finalPrice, buyerId } = req.body;

            if (finalPrice === undefined || finalPrice === null) {
                return sendResponse(res, STATUS_CODES.BAD_REQUEST, false, "finalPrice is required in the request body.");
            }

            if (!buyerId) {
                return sendResponse(res, STATUS_CODES.BAD_REQUEST, false, "buyerId is required in the request body.");
            }

            const result = await this.farmerService.updateFinalPrice(cropId, Number(finalPrice), buyerId);
            return sendResponse(res, STATUS_CODES.OK, true, result.message, result.crop);
        } catch (error: any) {
            return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, false, MESSAGES.INTERNAL_SERVER_ERROR, null, error.message);
        }
    }

    public async markAsSold(req: Request, res: Response) {
        try {
            const cropId = req.params.cropId as string;
            const updated = await this.farmerService.markAsSold(cropId);
            return sendResponse(res, STATUS_CODES.OK, true, "Crop marked as sold", updated);
        } catch (error: any) {
            return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, false, MESSAGES.INTERNAL_SERVER_ERROR, null, error.message);
        }
    }
}
