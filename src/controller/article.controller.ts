import { Request, Response } from "express";
import pool from "../db/db.config";
import { successResponse, errorResponse } from "../response/handleResponse";

export default class ArticleController {
    //create article
    async createArticle(req: Request, res: Response): Promise<void> {
        const { title, content } = req.body;
        const user_id = (req as any).user.id;
        if (!title || !content) {
            errorResponse(res, 400, "title and content required");
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
            const data = {
                message: "Article successfully posted",
                articleId: result.rows[0].article_id,
                createdOn: result.rows[0].created_at,
                title: title,
                article: content
            }
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Error creating article", err.message);
            errorResponse(res, 500, 'Internal Server Error');
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
                errorResponse(res, 404, "User not found");
                return;
            }
            const data = {
                message: "Article successfully updated",
                title: title,
            }
            successResponse(res, 201, data);
        } catch (err) {
            console.error(" Error creating article", (err as Error).message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

    //delete article
    async deleteArticle(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const result = await pool.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [id]);
            if (!result) {
                errorResponse(res, 404, "User not found");
                return;
            }
            const data = {
                message: "Article successfully deleted",
            }
            successResponse(res, 201, data);
        } catch (err) {
            console.error(" Error creating article", (err as Error).message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

    //add comment to article
    async createComment(req: Request, res: Response): Promise<void> {
        const { comment } = req.body;
        const article_id = req.params.id;
        const user_id = (req as any).user.id
        try {
            const article = await pool.query(`
                SELECT * FROM articles WHERE article_id = $1`, [article_id]
            )
            if (article.rowCount === 0) {
                errorResponse(res, 404, 'article not found');
                return;
            }

            const result = await pool.query(`
                INSERT INTO article_comments (comment, article_id, user_id, created_at)
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *`,
                [comment, article_id, user_id]
            );
            console.log("result =>", result);
            const data = {
                message: "Comment successfully created",
                createdOn: result?.rows[0]?.created_at,
                articleTitle: article.rows[0].title,
                article: article.rows[0].content,
                comment: comment
            }
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Error creating article comment", err.message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

    //get article
    async getArticle(req: Request, res: Response): Promise<void> {
        const article_id = req.params.id;
        try {
            const result = await pool.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]);
            //check this code =======>
            if (result.rowCount === 0) {
                errorResponse(res, 404, 'article not found');
                return;
            }
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
            });
            const data = {
                id: article_id,
                createdOn: result.rows[0].created_at,
                title: result.rows[0].title,
                article: result.rows[0].content,
                comments: articleComments
            }
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Error getting article", err.message);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }

}