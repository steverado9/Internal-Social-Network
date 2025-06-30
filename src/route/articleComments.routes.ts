import { Router } from "express";
import ArticleCommentController from "../controller/articleComment.controller";
import authenticate from "../middleware/authjwt";

class ArticleCommentRoute{
    router = Router();
    articleController = new ArticleCommentController();

      constructor() {
        this.initializeRoutes();
    };

     initializeRoutes(){
        //ADD COMMENT
        this.router.post("/:id/comment", authenticate.verifyToken, this.articleController.createComment);
    }

}

export default new ArticleCommentRoute().router;
