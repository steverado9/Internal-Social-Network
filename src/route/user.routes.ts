import { Router } from "express";
import UserController from "../controller/user.controller";
import auth from "../middleware/authjwt";

class UserRoutes {
    router = Router();
    userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
         //sign in
        this.router.post("/signin", auth.isAdmin, auth.verifyToken, this.userController.signin);

        //Signup
        this.router.post("/create-user" ,this.userController.createUser);
    }
}

export default new UserRoutes().router;