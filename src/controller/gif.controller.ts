import { Request, Response } from "express";
import pool from "../db/db.config";
import { successResponse, errorResponse } from "../response/handleResponse";

export default class GifController {
    //create gif
    async createGif(req: Request, res: Response): Promise<void> {
        const { title, image_url } = req.body;
        const user_id = (req as any).user.id
        if (!image_url || !title) {
            errorResponse(res, 400, "image and title required");
            return;
        }
        try {
            const text = `
                INSERT INTO gifs (image_url, title, user_id, created_at)
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *`;
            const values = [image_url, title, user_id];
            const result = await pool.query(text, values);
            console.log("result of gif = >", result.rows[0]);

            const data = {
                gifId: result.rows[0].gif_id,
                message: "GIF image successfully posted",
                createdOn: result.rows[0].created_at,
                title: title,
                imageUrl: image_url
            }
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Gif image upload error:", err.message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

    //delete gif
    async deletegif(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const result = await pool.query(`DELETE FROM gifs WHERE gif_id = $1 RETURNING *`, [id]);
            if (!result) {
                errorResponse(res, 404, "User not found");
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
        const user_id = (req as any).user.id
        try {
            const gif = await pool.query(`
                SELECT * FROM gifs WHERE gif_id = $1`, [gif_id]
            )
            if (gif.rowCount === 0) {
                errorResponse(res, 404, 'gif not found');
                return;
            }

            const result = await pool.query(`
                INSERT INTO gif (comment, gif_id, user_id, created_at)
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *`,
                [comment, gif_id, user_id]
            );
            console.log("result =>", result);
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
}
