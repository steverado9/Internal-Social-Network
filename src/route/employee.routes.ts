import { Router } from "express";
import employeeController from "../controller/employee.controller";

class EmployeeRoutes {
    router = Router();
    employeeController = new employeeController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/", this.employeeController.signup)
    }
}

export default new EmployeeRoutes().router;