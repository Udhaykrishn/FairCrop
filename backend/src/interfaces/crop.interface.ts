import { Document } from "mongoose";

export interface ILocation {
    lat: number;
    lon: number;
}

export interface ICrop extends Document {
    farmerId: string;
    crop: string;
    quantity: number;
    location: ILocation;
    isSold: boolean;
    reservedPrice: number;
    finalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
