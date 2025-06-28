import pool from "./db.config";
import bcrypt from "bcryptjs";

class Database {

    constructor() {
        this.connectToDataBase();
    }
    async connectToDataBase(): Promise<void> {
        try {
            await pool.query("SELECT NOW()");
            console.log("connection has been established successfully.");
            // Call seedRoles after syncing
            await this.usersTable();
            await this.createAdmin();
            await this.gifsTable();
            await this.articlesTable();
        } catch (err) {
            console.error("Unable to connect to the Database:", (err as Error).message);
        }
    }

    //The database needs to have those role records available
    private async usersTable() {
        try {
            //create table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users ( 
                    userID SERIAL PRIMARY KEY,
                    firstname VARCHAR(100),
                    lastname VARCHAR(100),
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    gender VARCHAR(10),
                    jobrole VARCHAR(50), 
                    department VARCHAR(100),
                    address TEXT
                );`
            );
            console.log("Users table created.");
        } catch (err) {
            console.error("Users Table creation failed:", (err as Error).message);
        }
    }

    private async createAdmin() {
        try {
             // insert user with hashed password
            const password = 'stephen123';
            const hashedPassword = await bcrypt.hash(password, 8);
            const text = `
                INSERT INTO users (firstname, lastname, email, password, gender, jobRole, department, address)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING *`;
            const values = ['Stephen', 'Isaac', 'isaac.stephen@example.com', hashedPassword, 'Male', 'admin', 'Engineering', '7 Adekoya Street, Lagos, Nigeria'];
            await pool.query(text, values);
            console.log("admin created sucessfully");

        } catch (err: any) {
            console.error("admin creation failed:", err.message);
        }
    }

    private async gifsTable() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS gifs (
                gifID SERIAL PRIMARY KEY,
                image_url TEXT,
                title VARCHAR(100),
                userID INTEGER,
                FOREIGN KEY(userID) REFERENCES users(userID)
                )`);
            console.log("gifs table created.");
        } catch (err) {
            console.error("gifs Table creation failed:", (err as Error).message);
        }
    }

    private async articlesTable() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS articles(
                articleID SERIAL PRIMARY KEY,
                title VARCHAR(100),
                content TEXT,
                userID INTEGER,
                FOREIGN KEY(userID) REFERENCES users(userID)
                )`);
            console.log("articles table created.");
        } catch (err) {
            console.error("articles Table creation failed:", (err as Error).message);
        }
    }
}

export default Database;