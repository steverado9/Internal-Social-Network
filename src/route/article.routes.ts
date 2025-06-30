import { Router } from "express";
import ArticleController from "../controller/article.controller";
import authenticate from "../middleware/authjwt";
 
class ArticleRoute {
    router = Router();
    articleController = new ArticleController();

    constructor() {
        this.initializeRoutes();
    };

    initializeRoutes() {
        //CREATE ARTICLE
        this.router.post("/", authenticate.verifyToken, this.articleController.createArticle);

        //EDIT ARTICLE
        this.router.put("/:id", authenticate.verifyToken, this.articleController.editArticle);

        //DELETE ARTICLE
        this.router.delete("/:id", authenticate.verifyToken, this.articleController.deleteArticle);

        //GET Article
        this.router.get("/:id", authenticate.verifyToken, this.articleController.getArticle);
    }
}

export default new ArticleRoute().router;
