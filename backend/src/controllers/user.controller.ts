import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages.constant";
import { STATUS_CODES } from "../constants/status-codes.constant";
import type { UserService } from "../services/user.service";
import { TYPES } from "../types/inversify.types";
import { sendResponse } from "../utils/response.util";

@injectable()
export class UserController {
	constructor(@inject(TYPES.UserService) private _userService: UserService) { }

	public async createUser(req: Request, res: Response) {
		try {
			const user = await this.userService.createUser(req.body);
			return sendResponse(
				res,
				STATUS_CODES.CREATED,
				true,
				MESSAGES.USER_CREATED,
				user,
			);
		} catch (error: any) {
			if (error.code === 11000) {
				return sendResponse(
					res,
					STATUS_CODES.BAD_REQUEST,
					false,
					MESSAGES.USER_EXISTS,
				);
			}
			return sendResponse(
				res,
				STATUS_CODES.INTERNAL_SERVER_ERROR,
				false,
				MESSAGES.INTERNAL_SERVER_ERROR,
				null,
				error.message,
			);
		}
	}
}
