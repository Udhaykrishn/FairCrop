import { injectable } from "inversify";
import { User } from "../models/user.model";
import { CreateUserDto } from "../dtos/user.dto";

@injectable()
export class UserService {
    public async createUser(data: CreateUserDto) {
        const user = new User(data);
        return await user.save();
    }
}
