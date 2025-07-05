import express, { Application } from "express";
import dotenv from "dotenv";
import Server from "./src/index";
import Database from "./src/db";
import Routes from "./src/route";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/swagger'; 

dotenv.config();

const app: Application = express();
new Server(app);
new Routes(app);
new Database();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

//Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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