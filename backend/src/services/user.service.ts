import { injectable } from "inversify";
import type { CreateUserDto } from "../dtos/user.dto";
import { User } from "../models/user.model";

@injectable()
export class UserService {
	public async createUser(data: CreateUserDto) {
		const user = new User(data);
		return await user.save();
	}
}
