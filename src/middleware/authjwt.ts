import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../db/db.config";

dotenv.config();

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = (req.headers["authorization"] as string).split(" ")[1]; //// token: "bearer xyz"

        if (!token) {
            res.status(403).json({ message: "No token provided!" });
            return;
        }

        Jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
            if (err) {
                console.error("err = >", err);
                res.status(401).json({ message: "Unauthorized!" });
                return;
            }
            (req as any).user = decoded;
            next();
        })
    } catch (err) {
        console.error("err => ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobRole = 'admin';
        const result = await pool.query(`
            SELECT * FROM users WHERE jobRole=$1` ,
            [jobRole]
        )
        if (!result) {
            res.status(404).json({
                message: "User not found!"
            });
        }

        const role = result.rows[0].jobRole
        if (role === jobRole) {
            next();
            return;
        }
        res.status(404).json({
            message: "Require admin Role!!"
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: 'Internal Server Error' });

    }
}

const auth = {
    verifyToken,
    isAdmin
};

export default auth;