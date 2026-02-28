import { injectable } from "inversify";
import type { CreateOfferDto, UpdateOfferDto } from "../dtos/offer.dto";
import { Offer } from "../models/offer.model";
import { Crop } from "../models/crop.model";

@injectable()
export class OfferService {
	async createOffer(data: CreateOfferDto & { buyerId?: string }) {
		try {
			// Find the crop to get the farmer's location and name
			const crop = await Crop.findById(data.cropId);
			if (!crop) {
				throw new Error("Crop not found");
			}

			// Map the incoming DTO to the Offer model structure
			const offerData = {
				buyerId: data.buyerId,
				quantity: data.quantity,
				price: data.price,
				cropId: data.cropId,
				farmer_location: typeof crop.location === 'object' ? 'Wayanad' : String(crop.location),
				buyer_location: data.location || "Unknown District"
			};

			return await Offer.create(offerData);
		} catch (error: any) {
			console.log("error is ", error.message);
			throw error; // Throw so controller handles it
		}
	}

	async updateOffer(id: string, data: UpdateOfferDto) {
		try {
			const offer = await Offer.findById(id);
			if (!offer) {
				throw new Error("Offer not found");
			}
			const updatedOffer = await Offer.findByIdAndUpdate(id, data, {
				new: true,
			});
			return updatedOffer;
		} catch (error: any) {
			throw error;
		}
	}

	async getOffer() {
		try {
			const offer = await Offer.find();
			if (!offer || offer.length === 0) {
				throw new Error("Offer not found");
			}
			return offer;
		} catch (error: any) {
			throw error;
		}
	}
}
