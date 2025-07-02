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
         //VIEW ALL THE ARTICLES BY TIME
        this.router.get("/", authenticate.verifyToken, this.feedController.feed);
    }
}

export default new FeedRoute().router;
