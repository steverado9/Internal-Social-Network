import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { errorResponse } from "../response/handleResponse";

export const validateSchema = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
            const errors = result.error.format();
            errorResponse(res, 400, "Validation error", errors);
            return;
        };

        // Attach parsed data to req.body (clean and validated)
        req.body = result.data;
        next();
    };
};