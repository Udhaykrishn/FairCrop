import { injectable } from "inversify";
import type { CreateOfferDto, UpdateOfferDto } from "../dtos/offer.dto";
import { Offer } from "../models/offer.model";

@injectable()
export class OfferService {
	async createOffer(data: CreateOfferDto) {
		try {
			const offer = await Offer.findById(data.cropId);
			if (offer) {
				throw new Error("Offer already exists");
			}
			return await Offer.create(data);
		} catch (error: any) {
			return error.message;
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
			return error.message;
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
			return error.message;
		}
	}
}
