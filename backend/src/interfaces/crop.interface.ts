import { Document } from "mongoose";


export interface IPendingOffer {
    buyerId: string;
    offeredPrice: number;
    status: "pending" | "confirmed" | "rejected";
}

export interface ICrop extends Document {
    farmerId: string;
    crop: string;
    quantity: number;
    location: string;
    isSold: boolean;
    reservedPrice: number;
    finalPrice: number;
    pendingOffer?: IPendingOffer;
    createdAt: Date;
    updatedAt: Date;
}
