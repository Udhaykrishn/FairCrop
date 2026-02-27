import mongoose, { type Document, Schema } from "mongoose";

export interface IOffer extends Document {
	quantity: number;
	price: number;
	cropId: string;
	status: string;
	location: string;
}

const OfferSchema: Schema = new Schema(
	{
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
