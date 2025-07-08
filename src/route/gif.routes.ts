import { Router } from "express";
import GifController from "../controller/gif.controller";
import authenticate from "../middleware/authjwt";
import { validateSchema } from "../middleware/validateSchema"; 
import { creategifSchema, addCommentSchema } from "../schema/schema";

class GifRoutes {
    router = Router();
    gifController = new GifController(); // FIXED typo here

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // CREATE GIF
        /**
         * @swagger
         * /v1/gifs:
         *   post:
         *     security: 
         *       - bearerAuth: []
         *     summary: Create a gif
         *     tags: [gifs]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - title
         *               - image
         *             properties:
         *               title:
         *                 type: string
         *               image:
         *                 type: string
         *     responses:
         *       201:
         *         description: Gif successfully posted
         *       400:
         *         description: Title and image required
         *       500:
         *         description: Internal server error
         */
        this.router.post("/", validateSchema(creategifSchema), authenticate.verifyToken, this.gifController.createGif);

        // DELETE GIF
        /**
         * @swagger
         * /v1/gifs/{id}:
         *   delete:
         *     security: 
         *       - bearerAuth: []
         *     summary: Delete a gif
         *     tags: [gifs]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: The gif ID
         *     responses:
         *       200:
         *         description: Gif successfully deleted
         *       404:
         *         description: Gif not found
         *       500:
         *         description: Internal server error
         */
        this.router.delete("/:id", authenticate.verifyToken, this.gifController.deletegif);

        // ADD COMMENT TO GIF
        /**
         * @swagger
         * /v1/gifs/{id}/comment:
         *   post:
         *     security: 
         *       - bearerAuth: []
         *     summary: Create a comment on a gif
         *     tags: [gifs]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: The gif ID
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
         *         description: Gif not found
         *       500:
         *         description: Internal server error
         */
        this.router.post("/:id/comment", validateSchema(addCommentSchema), authenticate.verifyToken, this.gifController.createComment);

        // GET ONE GIF BY ID
        /**
         * @swagger
         * /v1/gifs/{id}:
         *   get:
         *     security: 
         *       - bearerAuth: []
         *     summary: Retrieve a gif by ID
         *     tags: [gifs]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: integer
         *         required: true
         *         description: The gif ID
         *     responses:
         *       200:
         *         description: Gif retrieved successfully
         *       404:
         *         description: Gif not found
         *       500:
         *         description: Internal server error
         */
        this.router.get("/:id", authenticate.verifyToken, this.gifController.getOneGif);
    }
}

export default new GifRoutes().router;
