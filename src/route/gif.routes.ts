import { Router } from "express";
import GifController from "../controller/gif.controller";

class GifRoutes {
    router = Router();
    gitController = new GifController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        //CREATE GIF
        this.router.post("/", this.gitController.createGif);

        //DELETE GIF
        this.router.delete("/:id", this.gitController.deletegif);
    }
}

export default new GifRoutes().router