import mongoose, { type Document, Schema } from "mongoose";

export interface IOffer extends Document {
	buyerId: string;
	quantity: number;
	price: number;
	cropId: string;
	farmer_location: string;
	buyer_location: string;
	status: "pending" | "accepted" | "rejected";
}

const OfferSchema: Schema = new Schema(
	{
		buyerId: { type: String, ref: "Buyer", required: true },
		quantity: { type: Number, required: true },
		price: { type: Number, required: true },
		cropId: { type: String, ref: "Crop", required: true },
		farmer_location: { type: String, required: true },
		buyer_location: { type: String, required: true },
		status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
	},
	{ timestamps: true },
);

export const Offer = mongoose.model<IOffer>("Offer", OfferSchema);
