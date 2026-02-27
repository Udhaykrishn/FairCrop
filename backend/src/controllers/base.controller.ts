import { Response } from "express";
import { injectable } from "inversify";
import { sendResponse } from "../utils/response.util";

@injectable()
export abstract class BaseController {
    protected sendSuccess(res: Response, statusCode: number, message: string, data: any = null) {
        return sendResponse(res, statusCode, true, message, data);
    }

    protected sendError(res: Response, statusCode: number, message: string, error?: any) {
        return sendResponse(res, statusCode, false, message, null, error);
    }
}
