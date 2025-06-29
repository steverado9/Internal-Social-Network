import { Router } from "express";
import ArticleController from "../controller/article.controller";

class ArticleRoute {
    router = Router();
    articleController = new ArticleController();

    constructor() {
        this.initializeRoutes();
    };

    initializeRoutes() {
        //CREATE ARTICLE
        this.router.post("/", this.articleController.createArticle);

        //EDIT ARTICLE
        this.router.put("/:id", this.articleController.editArticle);

        //DELETE ARTICLE
        this.router.delete("/:id", this.articleController.deleteArticle);

        //ADD COMMENT
        this.router.delete("/:id/comment", this.articleController.addComment);

    }
}

export default new ArticleRoute().router;
