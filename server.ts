import express, { Application } from "express";
import dotenv from "dotenv";
import Server from "./src/index";
import Database from "./src/db";
import Routes from "./src/route";

dotenv.config();

const app: Application = express();

const server: Server = new Server(app);

const routes: Routes = new Routes(app);

const database: Database = new Database();

const PORT :number = process.env.PORT ?parseInt(process.env.PORT) : 3000;

app.listen(PORT, "localhost", () => {
    console.log(`Server is listening to port ${PORT}.`);
})
.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        console.log("Error: address already in use");
    } else {
        console.log(err);
    }
})