import { Router } from "express";
import employeeController from "../controller/employee.controller";
import auth from "../middleware/authjwt";

class EmployeeRoutes {
    router = Router();
    employeeController = new employeeController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        //Signup
        this.router.post("/create-user" ,this.employeeController.signup);

        //sign in
        this.router.post("/signin", auth ,this.employeeController.signin);

        //gif
        this.router.post("/gif", this.employeeController.gif);

        //article 
        this.router.post('/articles', this.employeeController.createArticle);
    }
}

export default new EmployeeRoutes().router;