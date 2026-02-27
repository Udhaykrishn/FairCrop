import { Router } from "express";
import { container } from "../config/inversify.config";
import { OfferController } from "../controllers/offer.controller";
import { CreateOfferDto, UpdateOfferDto } from "../dtos/offer.dto";
import { validateDto } from "../middlewares/validation.middleware";

const router = Router();

const offercontainer = container.get(OfferController);

router.get("/", (req, res) => offercontainer.getOffer(req, res));
router.post("/", validateDto(CreateOfferDto), (req, res) =>
	offercontainer.createOffer(req, res),
);
router.patch("/:id", validateDto(UpdateOfferDto), (req, res) =>
	offercontainer.updateOffer(req, res),
);

export default router;
