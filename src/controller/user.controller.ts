import { Request, Response } from "express";
import pool from "../db/db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export default class UserController {
    //create an user
    async createUser(req: Request, res: Response): Promise<void> {
        const { firstname, lastname, email, password, gender, job_role, department, address } = req.body;
        //Basic validation
        if (!email || !password) {
            res.status(400).json({
                message: "email and password required"
            });
            return;
        }

        // Validate role
        const allowedRoles = ['admin', 'employee'];
        if (!allowedRoles.includes(job_role)) {
            res.status(400).json({ message: 'Invalid job role' });
            return;
        }

        try {
            // Create the user with hashed password
            const hashedPassword = await bcrypt.hash(password, 8);

            const text = `
                INSERT INTO users (firstname, lastname, email, password, gender, job_role, department, address, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
                RETURNING *`;
            const values = [firstname, lastname, email, hashedPassword, gender, job_role, department, address];

            const result = await pool.query(text, values);

            //create jwt token
            const token = jwt.sign({ id: result.rows[0].user_id }, process.env.JWT_SECRET!, {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            })

            res.status(201).json({
                status: 'success',
                data: {
                    message: "User account successfully created",
                    token: token,
                    userId: result.rows[0].user_id,
                    user: {
                        firstname,
                        lastname,
                        email,
                        gender,
                        job_role,
                        department,
                        address
                    }
                    //return user created, expect password
                }
            })
        } catch (err) {
            console.error("Signup error:", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //signin
    async signin(req: Request, res: Response): Promise<void> {

        try {
            //getting the email and password from the req.body
            const { email, password } = req.body;

            const result = await pool.query(`
            SELECT * FROM users WHERE email=$1 `,
                [email]
            );

            if (!result) {
                res.status(404).json({
                    message: "User not found!"
                });
            }
            //comparing password from the req.body and database
            const isMatch = await bcrypt.compare(password, result.rows[0].password);
            if (!isMatch) {
                res.status(401).json({
                    message: "Invalid password!"
                });
            }
            //Generate token
            const token = jwt.sign({ id: result.rows[0].user_id, email: email, jobRole: result.rows[0].job_role },
                process.env.JWT_SECRET!, {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            })
            res.status(201).json({
                status: 'success',
                data: {
                    token: token,
                    userId: result.rows[0].user_id
                }
            })
        } catch (err) {
            console.error("Signup error:", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


}