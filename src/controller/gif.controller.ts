import { Request, Response } from "express";
import pool from "../db/db.config";
import { successResponse, errorResponse } from "../response/handleResponse";
import cloudinary from "../utils/cloudinary";

export default class GifController {
    //create gif
    async createGif(req: Request, res: Response): Promise<void> {

        const { title, image } = req.body;
        const user_id = (req as any).user.id
        if (!image || !title) {
            errorResponse(res, 400, "image and title required");
            return;
        }

        try {
            const cloudinaryImage = await cloudinary.uploader.upload(image);
            console.log("image_url = > ", cloudinaryImage.url);

            const text = `
                INSERT INTO gifs (image_url, title, user_id, created_at)
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *`;
            const values = [cloudinaryImage.url, title, user_id];
            const result = await pool.query(text, values);

            const data = {
                gifId: result.rows[0].gif_id,
                message: "GIF image successfully posted",
                createdOn: result.rows[0].created_at,
                title: title,
                imageUrl: result.rows[0].image_url
            }
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Gif image upload error:", err);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

    //delete gif
    async deletegif(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const result = await pool.query(`DELETE FROM gifs WHERE gif_id = $1 RETURNING *`, [id]);
            if (!result) {
                errorResponse(res, 404, "gif not found");
                return;
            }
            const data = {
                message: "gif post successfully deleted"
            }
            successResponse(res, 201, data);
        } catch (err) {
            console.error(" Error creating article", (err as Error).message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

    //add comment to gif 
    async createComment(req: Request, res: Response): Promise<void> {
        const { comment } = req.body;
        const gif_id = req.params.id;
        const user_id = (req as any).user.id;
        try {
            const gif = await pool.query(`
                SELECT * FROM gifs WHERE gif_id = $1`, [gif_id]
            )
            if (gif.rowCount === 0) {
                errorResponse(res, 404, 'gif not found');
                return;
            }

            const result = await pool.query(`
                INSERT INTO gif_comments (comment, gif_id, user_id, created_at)
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *`,
                [comment, gif_id, user_id]
            );
            const data = {
                message: "Comment successfully created",
                createdOn: result?.rows[0]?.created_at,
                gifTitle: gif.rows[0].title,
                comment: comment
            }
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Error creating gif comment", err.message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

     //get one gif
    async getOneGif(req: Request, res: Response): Promise<void> {
        const gif_id = req.params.id;
        try {
            const result = await pool.query(`SELECT * FROM gifs WHERE gif_id = $1`, [gif_id]);
            //if number of rows == 0
            if (result.rowCount === 0) {
                errorResponse(res, 404, 'gif not found');
                return;
            }
            const gifs = await pool.query(`SELECT * FROM gif_comments WHERE gif_id = $1`, [gif_id]);
            //array
            const comments = gifs.rows.map(comment => {
                return {
                    commentId: comment.comment_id,
                    comment: comment.comment,
                    authorID: comment.user_id
                }
            });
            const data = {
                id: gif_id,
                createdOn: result.rows[0].created_at,
                title: result.rows[0].title,
                url: result.rows[0].image_url,
                comments: comments
            }
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Error getting gifs", err.message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }
}
