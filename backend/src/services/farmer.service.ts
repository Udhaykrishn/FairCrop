import { injectable, inject } from "inversify";
import { Crop } from "../models/crop.model";
import { ICrop } from "../interfaces/crop.interface";
import { Farmer, IFarmer } from "../models/farmer.model";
import { PricingService } from "./pricing.service";
import { TYPES } from "../types/inversify.types";

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
}
