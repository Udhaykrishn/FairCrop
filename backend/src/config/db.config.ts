import mongoose from "mongoose";

export const connectDB = async () => {
	const MONGO_URI = process.env.MONGODB_URL;
	try {
		await mongoose.connect(MONGO_URI!);
		console.log("Connected to MongoDB successfully");
	} catch (err) {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	}
};
