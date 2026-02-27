import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	age?: number;
}

const UserSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		age: { type: Number },
	},
	{ timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);
