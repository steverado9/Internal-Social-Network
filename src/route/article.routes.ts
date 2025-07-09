import { Router } from "express";
import ArticleController from "../controller/article.controller";
import authenticate from "../middleware/authjwt";
import { validateSchema } from "../middleware/validateSchema";
import { createArticleSchema, editArticleSchema, addCommentSchema } from "../schema/schema";

class ArticleRoute {
    router = Router();
    articleController = new ArticleController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // CREATE ARTICLE
        /**
         * @swagger
         * /api/v1/articles:
         *   post:
         *     security: 
         *       - bearerAuth: []
         *     summary: Create an article
         *     tags: [articles]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - title
         *               - content
         *             properties:
         *               title:
         *                 type: string
         *               content:
         *                 type: string
         *     responses:
         *       201:
         *         description: Article successfully posted
         *       400:
         *         description: Title and content required
         *       500:
         *         description: Internal server error
         */
        this.router.post("/", validateSchema(createArticleSchema), authenticate.verifyToken, this.articleController.createArticle);

        // EDIT ARTICLE
        /**
         * @swagger
         * /api/v1/articles/{id}:
         *   put:
         *     security: 
         *       - bearerAuth: []
         *     summary: Edit an article
         *     tags: [articles]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: The article ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               title:
         *                 type: string
         *               content:
         *                 type: string
         *     responses:
         *       200:
         *         description: Article successfully updated
         *       404:
         *         description: Article not found
         *       500:
         *         description: Internal server error
         */
        this.router.put("/:id", validateSchema(editArticleSchema), authenticate.verifyToken, this.articleController.editArticle);

        // DELETE ARTICLE
        /**
         * @swagger
         * /api/v1/articles/{id}:
         *   delete:
         *     security: 
         *       - bearerAuth: []
         *     summary: Delete an article
         *     tags: [articles]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: The article ID
         *     responses:
         *       200:
         *         description: Article successfully deleted
         *       404:
         *         description: Article not found
         *       500:
         *         description: Internal server error
         */
        this.router.delete("/:id", authenticate.verifyToken, this.articleController.deleteArticle);

        // ADD COMMENT TO ARTICLE
        /**
         * @swagger
         * /api/v1/articles/{id}/comment:
         *   post:
         *     security: 
         *       - bearerAuth: []
         *     summary: Create a comment on an article
         *     tags: [articles]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: The article ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - comment
         *             properties:
         *               comment:
         *                 type: string
         *     responses:
         *       201:
         *         description: Comment successfully created
         *       400:
         *         description: Comment is required
         *       404:
         *         description: Article not found
         *       500:
         *         description: Internal server error
         */
        this.router.post("/:id/comment", validateSchema(addCommentSchema), authenticate.verifyToken, this.articleController.createComment);

        // GET ONE ARTICLE BY ID
        /**
         * @swagger
         * /api/v1/articles/{id}:
         *   get:
         *     security: 
         *       - bearerAuth: []
         *     summary: Retrieve an article by ID
         *     tags: [articles]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: integer
         *         required: true
         *         description: The article ID
         *     responses:
         *       200:
         *         description: Article retrieved successfully
         *       404:
         *         description: Article not found
         *       500:
         *         description: Internal server error
         */
        this.router.get("/:id", authenticate.verifyToken, this.articleController.getOneArticle);
    }
}

export default new ArticleRoute().router;
