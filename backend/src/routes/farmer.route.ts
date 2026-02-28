import { Router } from "express";
import { container } from "../config/inversify.config";
import { FarmerController } from "../controllers/farmer.controller";
import { Farmer } from "../models/farmer.model";

const router = Router();
const farmerController = container.get(FarmerController);

router.post("/list-crop", (req, res) => farmerController.createCrop(req, res));

router.get("/get-farmer", (req, res) => farmerController.getFarmers(req, res));

router.get("/get-crops", (req, res) => farmerController.getAllCrops(req, res));

router.get("/get-farmer", (req, res) => farmerController.getFarmers(req, res));

router.get("/seed-dev", async (_req, res) => {
    const existing = await Farmer.findOne({ phone: "+91-9876543210" });
    if (existing) {
        res.json({ message: "Farmer already exists", data: existing });
        return;
    }
    const farmer = await Farmer.create({ name: "Rajan Kumar", role: "farmer", phone: "+91-9876543210" });
    res.json({ message: "Dummy farmer inserted ✅", data: farmer });
});

router.get("/:farmerId", (req, res) => farmerController.getCropsByFarmer(req, res));

router.patch("/update-price/:cropId", (req, res) => farmerController.updateFinalPrice(req, res));

router.patch("/mark-sold/:cropId", (req, res) => farmerController.markAsSold(req, res));

export default router;
