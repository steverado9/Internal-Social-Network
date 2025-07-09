import { Router } from "express";
import authenticate from "../middleware/authjwt";
import FeedController from "../controller/feed.controller";

class FeedRoute {
    router = Router();
    feedController = new FeedController();

    constructor() {
        this.initializeRoute();
    }

    initializeRoute() {
        //VIEW ALL THE ARTICLES AND GIF BY TIME
        /**
        * @swagger
        * api/v1/feed:
        *   get:
        *     security: 
        *       - bearerAuth: []
        *     summary: Display all gifs and articles
        *     tags: [feed]
        *     responses:
        *       500:
        *         description: Internal server error
        */
        this.router.get("/", authenticate.verifyToken, this.feedController.feed);
    }
}

export default new FeedRoute().router;
