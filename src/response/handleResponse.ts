import { Response } from "express";

export const successResponse = (res: Response, statuscode: number, data?: Record<string, any>) => {
    return res.status(statuscode).json({
        status: "success",
        data
    })
}

export const errorResponse = (res: Response, statuscode: number, message: string, err?: any) => {
    return res.status(statuscode).json({
        message
    })
}

