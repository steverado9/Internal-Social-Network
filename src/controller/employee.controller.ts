import { Request, Response } from "express";
import pool from "../db/db.config";
import bcrypt from "bcryptjs";

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
                
            res.status(201).json({
                status: 'success',
                data: {
                    message: "User account successfully created",
                    userId: result.rows[0].id
                }
            })
        } catch(err) {
            console.error("Signup error:", err);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}