import { Application } from "express";
import userRoutes from "./user.routes";
import gifRoute from "./gif.routes";
import articleRoute from "./article.routes";
import homeRoute from "./home.route";

export default class Routes {
    constructor(app: Application) {
        app.use("/api/v1", homeRoute);
        app.use("/api/v1/auth", userRoutes);
        app.use("/api/v1/gifs", gifRoute);
        app.use("/api/v1/articles", articleRoute);
        console.log("start")
    };
}