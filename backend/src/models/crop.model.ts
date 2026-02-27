import mongoose, { Schema } from "mongoose";
import { ICrop } from "../interfaces/crop.interface";


const PendingOfferSchema: Schema = new Schema(
    {
        buyerId: { type: String, required: true },
        offeredPrice: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
    },
    { _id: false }
);

const CropSchema: Schema = new Schema(
    {
        farmerId: { type: String, required: true, index: true },
        crop: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        location: { type: String, required: true },
        isSold: { type: Boolean, default: false },
        reservedPrice: { type: Number, default: 0, min: 0 },
        finalPrice: { type: Number, default: 0, min: 0 },
        pendingOffer: { type: PendingOfferSchema, default: null },
    }, { timestamps: true }
);

export const Crop = mongoose.model<ICrop>("Crop", CropSchema);
