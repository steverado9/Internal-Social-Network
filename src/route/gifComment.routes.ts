import { Router } from "express";
import authenticate from "../middleware/authjwt";
import GifCommentController from "../controller/gifComment.controller";

class GifCommentRoute {
      router = Router();
      gifConmmentController = new GifCommentController();
}