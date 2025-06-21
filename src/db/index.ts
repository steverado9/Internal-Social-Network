import pool from "./db.config"

class Database {

    constructor() {
        this.connectToDataBase();
    }
    async connectToDataBase(): Promise<void> {
        try {
            await pool.connect();
            console.log("connection has been established successfully.");
        } catch (err) {
            console.error("Unable to connect to the Database:", (err as Error).message);
        }
    }
}

export default Database;