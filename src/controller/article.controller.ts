import { Request, Response } from "express";
import pool from "../db/db.config";

export default class ArticleController {
    //create article
    async createArticle(req: Request, res: Response): Promise<void> {
        const { title, content } = req.body;
        const user_id = (req as any).user.id;
        if (!title || !content) {
            res.status(400).json({ message: "title and content required" });
            return;
        }
        try {
            const text = `
                INSERT INTO articles (title, content, user_id, created_at)
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *`;
            const values = [title, content, user_id];
            const result = await pool.query(text, values);
            console.log("result of article = >", result.rows[0]);

            res.status(201).json({
                status: 'success',
                data: {
                    message: "Article successfully posted",
                    articleId: result.rows[0].article_id,
                    createdOn: result.rows[0].created_at,
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
                WHERE article_id=$3
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
            const result = await pool.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [id]);
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

    //get article
    async getArticle(req: Request, res: Response): Promise<void> {
        const article_id = req.params.id;
        try {
            const result = await pool.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]);
            const comments = await pool.query(`SELECT * FROM article_comments WHERE article_id = $1`, [article_id]);
            // console.log("result = >", result);
            console.log("comment =>", comments);
            //array
            const articleComments = comments.rows.map(comment => {
                return {
                    commentId: comment.comment_id,
                    comment: comment.comment,
                    authorID: comment.user_id
                }
            })


            res.status(201).json({
                status: 'success',
                data: {
                    id: article_id,
                    createdOn: result.rows[0].created_at,
                    title: result.rows[0].title,
                    article: result.rows[0].content,
                    comments: articleComments
                }
            })
        } catch (err: any) {
            console.error(" Error getting article", err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}