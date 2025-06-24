import pool from "./db.config"

class Database {

    constructor() {
        this.connectToDataBase();
    }
    async connectToDataBase(): Promise<void> {
        try {
            await pool.query("SELECT NOW()");
            console.log("connection has been established successfully.");
            // Call seedRoles after syncing
            await this.seedEmployee();
        } catch (err) {
            console.error("Unable to connect to the Database:", (err as Error).message);
        }
    }

    //The database needs to have those role records available
    private async seedEmployee() {
        try {
            
            //create table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS employees ( 
                    id SERIAL PRIMARY KEY,
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
            //insert into table
            const result = await pool.query(`
                INSERT INTO employees (firstname, lastname, email, password, gender, jobRole, department, address)
                VALUES ('Isaac', 'Stephen', 'isaac@example.com', 'stephen123', 'Male', 'admin', 'Engineering', 'Lagos, Nigeria')
                ON CONFLICT DO NOTHING`
            );
            console.log("Employees table seeded.");
        } catch (err) {
            console.error("Employees Table Seeding failed:", (err as Error).message);
        }


    }
}

export default Database;