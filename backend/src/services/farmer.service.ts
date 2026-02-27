import { injectable } from "inversify";
import { Crop } from "../models/crop.model";
import { ICrop } from "../interfaces/crop.interface";

@injectable()
export class FarmerService {
    public async createCrop(data: Partial<ICrop>): Promise<ICrop> {
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

        const crop = new Crop(data);
        return await crop.save();
    }
}
