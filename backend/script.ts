import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Farmer } from "./src/models/farmer.model";

// ── Dummy data ──────────────────────────────────────────────────────────────
const dummyFarmer = {
    name: "Rajan Kumar",
    role: "farmer",
    phone: "+91-9876543210",
};

// ── Seed function ───────────────────────────────────────────────────────────
const seed = async () => {
    const MONGO_URI = process.env.MONGODB_URL;
    if (!MONGO_URI) {
        console.error("❌  MONGODB_URL is not defined in .env");
        process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅  Connected to MongoDB");

    // Avoid duplicate on re-run
    const existing = await Farmer.findOne({ phone: dummyFarmer.phone });
    if (existing) {
        console.log("⚠️   Dummy farmer already exists — skipping insert.");
    } else {
        const farmer = await Farmer.create(dummyFarmer);
        console.log("🌱  Dummy farmer inserted:", farmer.toObject());
    }

    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
};

seed().catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
});
