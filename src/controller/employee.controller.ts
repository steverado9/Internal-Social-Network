import { Request, Response } from "express";
import pool from "../db/db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cloudinary from "../utils/cloudinary";


dotenv.config();

export default class employeeController {
    //create an employee
    async signup(req: Request, res: Response): Promise<void> {
        console.log("signup = >");
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
                INSERT INTO employees (firstname, lastname, email, password, gender, jobRole, department, address)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING *`;
            const values = [firstname, lastname, email, hashedPassword, gender, jobRole, department, address];

            const result = await pool.query(text, values);
            console.log("result = >");

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
                    userId: result.rows[0].id
                }
            })
        } catch (err) {
            console.error("Signup error:", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //signin
    async signin(req: Request, res: Response) {
        console.log("signin = >");
        try {
            //getting the email and password from the req.body
            const { email, password } = req.body;

            const result = await pool.query(`
            SELECT * FROM employees WHERE email=$1 `,
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
                    userId: result.rows[0].id
                }
            })
        } catch (err) {
            console.error("Signup error:", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //create gif
    async gif(req: Request, res: Response) {
        const { title, image_url } = req.body;
        if (!image_url || !title) {
            res.status(400).json({ message: "image and title required" });
            return;
        }
        try {
            const text = `
                INSERT INTO gif (image_url, title)
                VALUES ($1, $2) 
                RETURNING *`;
            const values = [image_url, title];
            const result = await pool.query(text, values);
            console.log("result of gif = >", result);

            res.status(201).json({
                status: 'success',
                data: {
                    gifId: result,
                    message: "GIF image successfully posted",
                    title: title,
                    imageUrl: image_url
                }
            })
        } catch (err) {
            console.error(" Gif image upload error:", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //create article
    async createArticle(req: Request, res: Response) {
        try {
            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content are required' });
            }

            const employeeID = req.user.id; // Assuming JWT middleware sets req.user

            const result = await pool.query(
                `INSERT INTO articles (title, content, employeeID)
         VALUES ($1, $2, $3)
         RETURNING *`,
                [title, content, employeeID]
            );

            return res.status(201).json({
                message: 'Article created successfully',
                data: result.rows[0],
            });
        } catch (error: any) {
            console.error('Error creating article:', error.message);
            return res.status(500).json({ message: 'Server error' });
        }
    }

}