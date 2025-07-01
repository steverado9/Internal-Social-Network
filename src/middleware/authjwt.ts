import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { successResponse, errorResponse } from "../response/handleResponse";
dotenv.config();

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {//optional chaining
        const token = (req.headers["authorization"] as string)?.split(" ")[1]; //// token: "bearer xyz"

        if (!token) {
            errorResponse(res, 403, "No token provided!");
            return;
        }

        Jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
            if (err) {
                console.error("err = >", err);
                errorResponse(res, 401, "Unauthorized!");
                return;
            }
            (req as any).user = decoded;
            next();
        })
    } catch (err) {
        console.error("err => ", err);
        errorResponse(res, 500, "Internal Server Error" );
    }
}

const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const job_role = 'admin';
        const role = (req as any).user.jobRole
        if (role === job_role) {
            next();
            return;
        }
        errorResponse(res, 404, "Require admin Role!!");
    } catch (err) {
        console.error("Signup error:", err);
        errorResponse(res, 500, 'Internal Server Error');
    }
}

const auth = {
    verifyToken,
    isAdmin
};

export default auth;