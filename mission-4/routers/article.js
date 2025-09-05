import express from "express";
import commentRouter from "./comment.js";
import parentIdParser from "../middlewares/parnetIdParser.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ArticleController from "../controllers/articleController.js";
import articleValidator from "../middlewares/validation.middleware/articleValidator.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorizaion.js";
import optionalAuthentication from "../middlewares/optionalAuthentication.js";

const articleRouter = express.Router();

articleRouter.use("/:id/comment", parentIdParser, commentRouter);

// prettier-ignore
articleRouter.route('/')
    .get(optionalAuthentication(), articleValidator(), asyncHandler(ArticleController.getArticleList))
    .post(authentication(), articleValidator(), asyncHandler(ArticleController.postArticle))

// prettier-ignore
articleRouter
  .route("/:id")
  .get(optionalAuthentication(), articleValidator(), asyncHandler(ArticleController.getArticle))
  .patch(authentication(), articleValidator(), authorization('article'), asyncHandler(ArticleController.patchArticle))
  .delete(authentication(), articleValidator(), authorization('article'), asyncHandler(ArticleController.deleteArticle));

// prettier-ignore
articleRouter.route("/:id/likes")
  .post(authentication(), articleValidator(), asyncHandler(ArticleController.postArticleLike))
  .delete(authentication(), articleValidator(), asyncHandler(ArticleController.deleteArticleLike))

export default articleRouter;
