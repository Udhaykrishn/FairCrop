import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { sendResponse } from "../utils/response.util";
import { STATUS_CODES } from "../constants/status-codes.constant";
import { MESSAGES } from "../constants/messages.constant";

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
                formattedErrors
            );
        }

        req.body = dtoObject;
        next();
    };
};
