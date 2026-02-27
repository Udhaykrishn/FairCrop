import { Container } from "inversify";
import { TYPES } from "../types/inversify.types";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import { FarmerService } from "../services/farmer.service";
import { FarmerController } from "../controllers/farmer.controller";

const container = new Container();

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(UserController).toSelf();
container.bind<FarmerService>(TYPES.FarmerService).to(FarmerService);
container.bind<FarmerController>(FarmerController).toSelf();

export { container };
