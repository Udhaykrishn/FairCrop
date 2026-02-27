import { injectable, inject } from "inversify";
import { Crop } from "../models/crop.model";
import { ICrop } from "../interfaces/crop.interface";
import { Farmer, IFarmer } from "../models/farmer.model";
import { PricingService } from "./pricing.service";
import { TYPES } from "../types/inversify.types";
import { getIO, getFarmerSocketId } from "../socket/socket.gateway";

@injectable()
export class FarmerService {
    constructor(
        @inject(TYPES.PricingService) private pricingService: PricingService
    ) { }

    public async createCrop(data: Partial<ICrop>): Promise<ICrop> {
        // 1. Duplicate check
        const existing = await Crop.findOne({
            farmerId: data.farmerId,
            crop: data.crop,
            isSold: false,
        });

        if (existing) {
            throw new Error(
                `An active listing for "${data.crop}" already exists for farmer ${data.farmerId}.`
            );
        }

        // 2. Fetch reserved price from pricing API (mock)
        const pricing = await this.pricingService.getReservedPrice(
            data.crop as string,
            data.quantity as number,
            data.location as { lat: number; lon: number }
        );

        // 3. Stamp the reserved price on the crop before saving
        data.reservedPrice = pricing.reservedPrice;

        // 4. Save and return
        const crop = new Crop(data);
        return await crop.save();
    }

    public async getFarmers(): Promise<IFarmer[]> {
        return await Farmer.find().sort({ createdAt: -1 });
    }

    public async getCropsByFarmer(farmerId: string): Promise<ICrop[]> {
        return await Crop.find({ farmerId }).sort({ createdAt: -1 });
    }

    public async getAllCrops(): Promise<ICrop[]> {
        return await Crop.find().sort({ createdAt: -1 });
    }

    public async updateFinalPrice(
        cropId: string,
        finalPrice: number,
        buyerId: string
    ): Promise<{ message: string; crop: ICrop }> {
        if (finalPrice < 0) {
            throw new Error("Final price cannot be negative.");
        }

        const crop = await Crop.findById(cropId);
        if (!crop) {
            throw new Error(`Crop with ID "${cropId}" not found.`);
        }

        if (crop.isSold) {
            throw new Error("This crop is already sold.");
        }

        if (crop.pendingOffer && crop.pendingOffer.status === "pending") {
            throw new Error("A price offer is already pending for this crop. Wait for the farmer to respond.");
        }

        // Store the offer as pending
        crop.pendingOffer = { buyerId, offeredPrice: finalPrice, status: "pending" };
        await crop.save();

        // Emit real-time notification to the farmer
        const farmerSocketId = getFarmerSocketId(crop.farmerId);
        if (farmerSocketId) {
            getIO().to(farmerSocketId).emit("price:offer", {
                cropId: crop._id,
                cropName: crop.crop,
                quantity: crop.quantity,
                reservedPrice: crop.reservedPrice,
                offeredPrice: finalPrice,
                buyerId,
                message: `Buyer ${buyerId} offered ₹${finalPrice} for your ${crop.crop}.`,
            });
        } else {
            console.warn(`[Socket] Farmer ${crop.farmerId} is offline — offer saved but not delivered in real-time.`);
        }

        return {
            message: "Offer sent to farmer. Waiting for confirmation.",
            crop,
        };
    }

    public async markAsSold(cropId: string): Promise<ICrop> {
        const crop = await Crop.findById(cropId);

        if (!crop) {
            throw new Error(`Crop with ID "${cropId}" not found.`);
        }

        if (crop.isSold) {
            throw new Error(`Crop with ID "${cropId}" is already marked as sold.`);
        }

        crop.isSold = true;
        return await crop.save();
    }
}
