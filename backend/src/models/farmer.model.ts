import mongoose, { Schema, Document } from "mongoose";

export interface IFarmer extends Document {
    name: string;
    role: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}

const FarmerSchema = new Schema<IFarmer>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true, default: "farmer" },
        phone: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export const Farmer = mongoose.model<IFarmer>("Farmer", FarmerSchema);
