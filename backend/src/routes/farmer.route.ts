import { Router } from "express";
import { container } from "../config/inversify.config";
import { FarmerController } from "../controllers/farmer.controller";
import { Farmer } from "../models/farmer.model";

const router = Router();
const farmerController = container.get(FarmerController);

// POST /api/farmer/list-crop — list a new crop
router.post("/list-crop", (req, res) => farmerController.createCrop(req, res));

// GET /api/farmer/get-farmer — get all farmers
router.get("/get-farmer", (req, res) => farmerController.getFarmers(req, res));

// GET /api/farmer/seed-dev — insert dummy farmer (dev only, remove after use)
router.get("/seed-dev", async (_req, res) => {
    const existing = await Farmer.findOne({ phone: "+91-9876543210" });
    if (existing) {
        res.json({ message: "Farmer already exists", data: existing });
        return;
    }
    const farmer = await Farmer.create({ name: "Rajan Kumar", role: "farmer", phone: "+91-9876543210" });
    res.json({ message: "Dummy farmer inserted ✅", data: farmer });
});

// GET /api/farmer/:farmerId — get all crops for a farmer
router.get("/:farmerId", (req, res) => farmerController.getCropsByFarmer(req, res));

export default router;
