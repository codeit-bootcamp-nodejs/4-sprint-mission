import express from "express";
import commentRouter from "./comment.js";
import parentIdParser from "../middlewares/parnetIdParser.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ArticleController from "../controllers/articleController.js";
import articleValidator from "../middlewares/articleValidator.js";

const articleRouter = express.Router();

articleRouter.use("/:id/comment", parentIdParser, commentRouter);

// prettier-ignore
articleRouter.route('/')
    .get(articleValidator(), asyncHandler(ArticleController.getArticleList))
    .post(articleValidator(),asyncHandler(ArticleController.postArticle))

articleRouter
  .route("/:id")
  .get(articleValidator(), asyncHandler(ArticleController.getArticle))
  .patch(articleValidator(), asyncHandler(ArticleController.patchArticle))
  .delete(articleValidator(), asyncHandler(ArticleController.deleteArticle));

export default articleRouter;
