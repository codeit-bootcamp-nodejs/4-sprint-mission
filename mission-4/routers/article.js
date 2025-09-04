import express from "express";
import commentRouter from "./comment.js";
import parentIdParser from "../middlewares/parnetIdParser.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ArticleController from "../controllers/articleController.js";
import articleValidator from "../middlewares/validation.middleware/articleValidator.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorizaion.js";

const articleRouter = express.Router();

articleRouter.use("/:id/comment", parentIdParser, commentRouter);

// prettier-ignore
articleRouter.route('/')
    .get(articleValidator(), asyncHandler(ArticleController.getArticleList))
    .post(authentication(), articleValidator(), asyncHandler(ArticleController.postArticle))

// prettier-ignore
articleRouter
  .route("/:id")
  .get(articleValidator(), asyncHandler(ArticleController.getArticle))
  .patch(authentication(), articleValidator(), authorization('article'), asyncHandler(ArticleController.patchArticle))
  .delete(authentication(), articleValidator(), authorization('article'), asyncHandler(ArticleController.deleteArticle));

export default articleRouter;
