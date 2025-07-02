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

        //ADD COMMENT TO ARTICLE
        this.router.post("/:id/comment", authenticate.verifyToken, this.articleController.createComment);

        //GET ONE ARTICLE BY ID
        this.router.get("/:id", authenticate.verifyToken, this.articleController.getOneArticle);

    }
}

export default new ArticleRoute().router;
