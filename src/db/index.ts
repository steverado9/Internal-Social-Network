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
            // Call all the tables after establishing connection
            // await this.dropTables();
            await this.usersTable();
            await this.createAdmin();
            await this.gifsTable();
            await this.articlesTable();
            await this.articleCommentTable();
        } catch (err) {
            console.error("Unable to connect to the Database:", (err as Error).message);
        }
    }

    //The database needs to have those role records available
    private async dropTables() {
        try {
            //drop Table if it exist
            await pool.query(`DROP TABLE IF EXISTS article_comments`);
            await pool.query(`DROP TABLE IF EXISTS gifs`);
            await pool.query(`DROP TABLE IF EXISTS articles`);
            await pool.query(`DROP TABLE IF EXISTS users`);
            console.log("All tables dropped.");
        } catch (err) {
            console.error(" Table drop failed:", (err as Error).message);
        }
    }
    private async usersTable() {
        try {
            //create table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users ( 
                    user_id SERIAL PRIMARY KEY,
                    firstname VARCHAR(100) NOT NULL,
                    lastname VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    gender VARCHAR(10) NOT NULL,
                    job_role VARCHAR(50) NOT NULL, 
                    department VARCHAR(100) NOT NULL,
                    address TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE
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
                INSERT INTO users (firstname, lastname, email, password, gender, job_role, department, address, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
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
                gif_id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                title VARCHAR(100) NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE,
                FOREIGN KEY(user_id) REFERENCES users(user_id)
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
                article_id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE,
                FOREIGN KEY(user_id) REFERENCES users(user_id)
                )`);
            console.log("articles table created.");
        } catch (err) {
            console.error("articles Table creation failed:", (err as Error).message);
        }
    }

    private async articleCommentTable() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS article_comments(
                comment_id SERIAL PRIMARY KEY,
                comment TEXT NOT NULL,
                article_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE,
                FOREIGN KEY(article_id) REFERENCES articles(article_id),
                FOREIGN KEY(user_id) REFERENCES users(user_id))
                `);
            console.log("article comment table created.");
        } catch (err) {
            console.error("article comment Table creation failed:", (err as Error).message);
         }
    }
}

export default Database;