import { Application } from "express";
import userRoutes from "./user.routes";
import gifRoutes from "./gif.routes";
import articleRoutes from "./article.routes";
import articleCommentRoutes from "./articleComments.routes";

export default class Routes {
    constructor(app: Application) {
        app.use("/api/v1/auth", userRoutes);
        app.use("/api/v1/gifs", gifRoutes);
        app.use("/api/v1/articles", articleRoutes);
        app.use("/api/v1/articles", articleCommentRoutes);
        console.log("start")
    };
}