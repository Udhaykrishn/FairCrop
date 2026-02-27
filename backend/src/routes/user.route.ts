import { Router } from "express";
import { container } from "../config/inversify.config";
import { UserController } from "../controllers/user.controller";
import { validateDto } from "../middlewares/validation.middleware";
import { CreateUserDto } from "../dtos/user.dto";

const router = Router();
const userController = container.get(UserController);

router.post(
    "/",
    validateDto(CreateUserDto),
    (req, res) => userController.createUser(req, res)
);

export default router;
