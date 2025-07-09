import { Request, Response } from "express";
import pool from "../db/db.config";
import { successResponse, errorResponse } from "../response/handleResponse";

export default class FeedController {
    //view all articles
    async feed(req: Request, res: Response): Promise<void> {
        console.log("feed = >");
        try {
            const articles = await pool.query(`SELECT * FROM articles  ORDER BY created_at DESC`);
            const gifs = await pool.query(` SELECT * FROM gifs ORDER BY created_at DESC`);
        
            const article_data = articles.rows.map(article => {
                return {
                    article_id: article.article_id,
                    createdOn: article.created_at,
                    title: article.title,
                    article: article.content,
                    author_id: article.user_id
                }
            });
             const gif_data = gifs.rows.map(gif => {
                return {
                    gif_id: gif.gif_id,
                    createdOn: gif.created_at,
                    title: gif.title,
                    url: gif.image_url,
                    author_id: gif.user_id
                }
            });
            const data = [...article_data, ...gif_data];
            data.sort((a, b) => b.createdOn - a.createdOn);
            
            successResponse(res, 201, data);
        } catch (err: any) {
            console.error(" Error getting all the articles", err);
            errorResponse(res, 500, 'Internal Server Error');
        }
    }
}