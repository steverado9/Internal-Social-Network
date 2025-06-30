import { Request, Response } from "express";
import pool from "../db/db.config";

export default class GifController {
    //create gif
    async createGif(req: Request, res: Response): Promise<void> {
        const { title, image_url } = req.body;
        const user_id = (req as any).user.id
        if (!image_url || !title) {
            res.status(400).json({ message: "image and title required" });
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

            res.status(201).json({
                status: 'success',
                data: {
                    gifId: result.rows[0].gif_id,
                    message: "GIF image successfully posted",
                    createdOn: result.rows[0].created_at,
                    title: title,
                    imageUrl: image_url
                }
            })
        } catch (err: any) {
            console.error(" Gif image upload error:", err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //delete gif
    async deletegif(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const result = await pool.query(`DELETE FROM gifs WHERE gif_id = $1 RETURNING *`, [id]);
            if (!result) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(201).json({
                status: 'success',
                data: {
                    message: "gif post successfully deleted",
                }
            });
        } catch (err) {
            console.error(" Error creating article", (err as Error).message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
