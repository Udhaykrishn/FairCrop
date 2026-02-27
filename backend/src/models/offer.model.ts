import mongoose, { type Document, Schema } from "mongoose";

export interface IOffer extends Document {
	buyerId: string;
	quantity: number;
	price: number;
	cropId: string;
	status: string;
	farmer_location: string;
	buyer_location: string;
}

const OfferSchema: Schema = new Schema(
	{
		buyerId: { type: String, ref: "Buyer", required: true },
		quantity: { type: Number, required: true },
		price: { type: Number, required: true },
		cropId: { type: String, ref: "Crop", required: true },
		status: { type: String, required: true, default: "pending" },
		farmer_location: { type: String, required: true },
		buyer_location: { type: String, required: true },
	},
	{ timestamps: true },
);

export const Offer = mongoose.model<IOffer>("Offer", OfferSchema);
