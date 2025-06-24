import { Application } from "express";
import homeRoute from "./home.route";
import employeeRoutes from "./employee.routes";

export default class Routes {
    constructor(app: Application) {
        app.use("/api/v1", homeRoute);
        app.use("/api/v1/employees", employeeRoutes);
    };
}