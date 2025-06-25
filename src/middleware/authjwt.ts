import { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = (req.headers["authorization"] as string).split(" ")[1]; //// token: "bearer xyz"

        if (!token) {
            res.status(403).json({ message: "No token provided!" });
            return;
        }

        Jwt.verify( token , process.env.JWT_SECRET!, (err, decoded: any) => {
            if (err) {
                console.error("err = >", err);
                res.status(401).json({ message: "Unauthorized!"});
                return;
            }
            (req as any).user = decoded;
            next();
        })
    }  catch (err) {
        console.error("err => ", err );
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export default verifyToken;