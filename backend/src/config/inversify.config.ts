import { Container } from "inversify";
import { ChatController } from "../controllers/chat.controller";
import { OfferController } from "../controllers/offer.controller";
import { UserController } from "../controllers/user.controller";
import { FarmerService } from "../services/farmer.service";
import { FarmerController } from "../controllers/farmer.controller";
import { AiService } from "../services/ai.service";
import { ChatService } from "../services/chat.service";
import { OfferService } from "../services/offer.service";
import { UserService } from "../services/user.service";
import { CHAT_TYPES } from "../types/chat.type";
import { TYPES } from "../types/inversify.types";
import { OFFERS } from "../types/offers.type";

const container = new Container();

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(UserController).toSelf();
container.bind<FarmerService>(TYPES.FarmerService).to(FarmerService);
container.bind<FarmerController>(FarmerController).toSelf();

container.bind<OfferService>(OFFERS.OfferService).to(OfferService);
container.bind<OfferController>(OfferController).toSelf();

container.bind<AiService>(CHAT_TYPES.AiService).to(AiService);
container.bind<ChatService>(CHAT_TYPES.ChatService).to(ChatService);
container.bind<ChatController>(CHAT_TYPES.ChatController).to(ChatController);

export { container };
