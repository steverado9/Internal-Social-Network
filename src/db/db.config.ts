import dotenv from "dotenv";
import fs from "fs";
import pkg from "pg";


dotenv.config();

const { Pool } = pkg;


const pool = new Pool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    port: Number(process.env.PORT!),
    database: process.env.DB_NAME!,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('ca.pem').toString() || process.env.PG_CA,
    },
    max: 20, // Max number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

export default pool;

