import mongoose, { type Document, Schema } from "mongoose";

export interface IOffer extends Document {
	quantity: number;
	price: number;
	cropId: string;
	status: string;
	location: {
		lat: number;
		lon: number;
	};
}

const OfferSchema: Schema = new Schema(
	{
		quantity: { type: Number, required: true },
		price: { type: Number, required: true },
		cropId: { type: String, ref: "Crop", required: true },
		status: { type: String, required: true, default: "pending" },
		location: {
			lat: { type: Number, required: true },
			lon: { type: Number, required: true },
		},
	},
	{ timestamps: true },
);

export const Offer = mongoose.model<IOffer>("Offer", OfferSchema);
