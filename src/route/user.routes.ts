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
        //Signup
        this.router.post("/create-user", auth.verifyToken, auth.isAdmin, this.userController.createUser);

        //sign in
        this.router.post("/signin", this.userController.signin);
    }
}

export default new UserRoutes().router;