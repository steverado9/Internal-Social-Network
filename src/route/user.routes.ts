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

        // SIGNUP - CREATE USER
        /**
         * @swagger
         * /v1/auth/create-user:
         *   post:
         *     security: 
         *       - bearerAuth: []
         *     summary: Create a new employee account (admin only)
         *     tags: [users]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - email
         *               - password
         *             properties:
         *               firstname:
         *                 type: string
         *               lastname:
         *                 type: string
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *               gender:
         *                 type: string
         *               job_role:
         *                 type: string
         *               department:
         *                 type: string
         *               address:
         *                 type: string
         *     responses:
         *       201:
         *         description: Employee account successfully created
         *       400:
         *         description: Email and password required
         *       500:
         *         description: Internal server error
         */
        this.router.post("/create-user", auth.verifyToken, auth.isAdmin, this.userController.createUser);

        // SIGN IN
        /**
         * @swagger
         * /v1/auth/signin:
         *   post:
         *     summary: Sign in an employee or admin
         *     tags: [auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - email
         *               - password
         *             properties:
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: Login successful
         *       400:
         *         description: Email and password required
         *       401:
         *         description: Invalid password
         *       404:
         *         description: User not found
         *       500:
         *         description: Internal server error
         */
        this.router.post("/signin", this.userController.signin);
    }
}

export default new UserRoutes().router;
