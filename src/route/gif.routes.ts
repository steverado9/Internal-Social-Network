import { Router } from "express";
import GifController from "../controller/gif.controller";
import authenticate from "../middleware/authjwt";

class GifRoutes {
    router = Router();
    gitController = new GifController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        //CREATE GIF
        this.router.post("/", authenticate.verifyToken, this.gitController.createGif);

        //DELETE GIF
        this.router.delete("/:id", authenticate.verifyToken, this.gitController.deletegif);

        //ADD COMMENT TO GIF
        this.router.post("/:id/gif", authenticate.verifyToken, this.gitController.createComment);

        //GET ONE ARTICLE BY ID
        this.router.get("/:id", authenticate.verifyToken, this.gitController.getOneGif);



    }
}

export default new GifRoutes().router