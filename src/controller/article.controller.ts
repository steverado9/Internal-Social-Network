import { Request, Response } from "express";
import pool from "../db/db.config";

export default class ArticleController {
    //create article
    async createArticle(req: Request, res: Response): Promise<void> {
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).json({ message: "title and content required" });
            return;
        }
        try {
            const text = `
                INSERT INTO articles (title, content)
                VALUES ($1, $2) 
                RETURNING *`;
            const values = [title, content];
            const result = await pool.query(text, values);
            console.log("result of gif = >", result.rows[0]);

            res.status(201).json({
                status: 'success',
                data: {
                    message: "Article successfully posted",
                    articleId: result.rows[0].articleid,
                    title: title,
                    article: content
                }
            })
        } catch (err: any) {
            console.error(" Error creating article", err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //edit article
    async editArticle(req: Request, res: Response): Promise<void> {
        const { title, content } = req.body;
        const id = req.params.id;
        try {
            const result = await pool.query(`
                UPDATE articles SET title=$1, content=$2
                WHERE articleid=$3
                RETURNING *`,
                [title, content, id]
            );
            if (!result) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(201).json({
                status: 'success',
                data: {
                    message: "Article successfully updated",
                    title: title,
                }
            })
        } catch (err) {
            console.error(" Error creating article", (err as Error).message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //delete article
    async deleteArticle(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const result = await pool.query(`DELETE FROM articles WHERE articleid = $1 RETURNING *`, [id]);
            if (!result) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(201).json({
                status: 'success',
                data: {
                    message: "Article successfully deleted",
                }
            });
        } catch (err) {
            console.error(" Error creating article", (err as Error).message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}