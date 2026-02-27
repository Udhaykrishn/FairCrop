import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { MESSAGES } from "../constants/messages.constant";
import { STATUS_CODES } from "../constants/status-codes.constant";
import { sendResponse } from "../utils/response.util";

export const validateDto = (dtoClass: any) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dtoObject = plainToInstance(dtoClass, req.body);
		const errors = await validate(dtoObject);

		if (errors.length > 0) {
			const formattedErrors = errors.map((error) => ({
				property: error.property,
				constraints: error.constraints,
			}));
			return sendResponse(
				res,
				STATUS_CODES.BAD_REQUEST,
				false,
				MESSAGES.VALIDATION_ERROR,
				null,
				formattedErrors,
			);
		}

		req.body = dtoObject;
		next();
	};
};
