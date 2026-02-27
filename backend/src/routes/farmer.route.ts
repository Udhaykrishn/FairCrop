import { Router } from "express";
import { container } from "../config/inversify.config";
import { FarmerController } from "../controllers/farmer.controller";

const router = Router();
const farmerController = container.get(FarmerController);

// POST /api/farmer       — list a new crop
router.post("/list-crop", (req, res) => farmerController.createCrop(req, res));

// GET /api/farmer/getfarmer  — get all farmers
router.get("/get-farmer", (req, res) => farmerController.getFarmers(req, res));

// GET /api/farmer/:farmerId  — get all crops for a farmer
router.get("/:farmerId", (req, res) => farmerController.getCropsByFarmer(req, res));

// PATCH /api/farmer/update-price/:cropId  — update the final price of a crop
router.patch("/update-price/:cropId", (req, res) => farmerController.updateFinalPrice(req, res));

export default router;
