import { Request, Response } from "express";
import pool from "../db/db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export default class UserController {
    //signin
    async signin(req: Request, res: Response): Promise<void> {
        console.log("signin = >");
        
        try {
            //getting the email and password from the req.body
            const { email, password } = req.body;

            const result = await pool.query(`
            SELECT * FROM users WHERE email=$1 `,
                [email]
            );
            console.log("result = >", result);

            if (!result) {
                res.status(404).json({
                    message: "User not found!"
                });
            }
            //comparing password from the req.body and database
            console.log("password = >", password);
            console.log("result password = >", result.rows[0].password);
            const isMatch = await bcrypt.compare(password, result.rows[0].password);
            if (!isMatch) {
                res.status(401).json({
                    message: "Invalid password!"
                });
            }
            //Generate token
            const token = jwt.sign({ id: result.rows[0].id, email: email, password: password, jobRole: result.rows[0].jobRole },
                process.env.JWT_SECRET!, {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            })
            res.status(201).json({
                status: 'success',
                data: {
                    token: token,
                    userId: result.rows[0].userid
                }
            })
        } catch (err) {
            console.error("Signup error:", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //create an user
    async createUser(req: Request, res: Response): Promise<void> {
        console.log("create user = >");
        const { firstname, lastname, email, password, gender, jobRole, department, address } = req.body;
        //Basic validation
        if (!email || !password) {
            res.status(400).json({
                message: "email and password required"
            });
            return;
        }

        // Validate role
        const allowedRoles = ['admin', 'employee'];
        if (!allowedRoles.includes(jobRole)) {
            res.status(400).json({ message: 'Invalid job role' });
            return;
        }

        try {
            // Create the user with hashed password
            const hashedPassword = await bcrypt.hash(password, 8);

            const text = `
                INSERT INTO users (firstname, lastname, email, password, gender, jobRole, department, address)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING *`;
            const values = [firstname, lastname, email, hashedPassword, gender, jobRole, department, address];

            const result = await pool.query(text, values);
            console.log("result = >", result.rows[0]);

            //create jwt token
            const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET!, {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            })

            res.status(201).json({
                status: 'success',
                data: {
                    message: "User account successfully created",
                    token: token,
                    userId: result.rows[0].userid
                }
            })
        } catch (err) {
            console.error("Signup error:", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    
}