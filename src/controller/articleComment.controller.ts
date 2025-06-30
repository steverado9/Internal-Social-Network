import { Request, Response } from "express";
import pool from "../db/db.config";

export default class ArticleCommentController{
    //create comment
    async createComment(req: Request, res: Response): Promise<void> {
        const { comment } = req.body;
        const article_id = req.params.id;
        const user_id = (req as any).user.id 
        try {
            const article = await pool.query(`
                SELECT * FROM articles WHERE article_id = $1`, [article_id]
            )
            if (!article) {
                res.status(404).json({ message: "Article does not exist"});
                return;
            }

            const result = await pool.query(`
                INSERT INTO article_comments (comment, article_id, user_id, created_at)
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *`,
                [comment, article_id, user_id]
            );
            console.log("result =>", result);

            res.status(201).json({
                status: 'success',
                data: {
                    message: "Comment successfully created",
                    createdOn: result?.rows[0]?.created_at,
                    articleTitle: article.rows[0].title,
                    article: article.rows[0].content,
                    comment: comment
                }
            })
        }catch (err: any) {
            console.error(" Error creating article comment", err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}