import express from "express";
import { articleController } from "../controllers/articleController.js";
import {
  validateArticleCreate,
  validateId,
  validateArticleQuery,
} from "../middlewares/validate.js";
import articleCommentRouter from "./articleCommentsRouter.js";
import likeRouter from "./articleLikeRouter.js";
import passport from "../lib/passport/index.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(validateArticleQuery, optionalAuth, articleController.getArticleList)
  .post(
    validateArticleCreate,
    passport.authenticate("access-token", { session: false }),
    articleController.postArticle
  );

articleRouter
  .route("/:id")
  .get(validateId, optionalAuth, articleController.getArticleById)
  .patch(
    validateId,
    passport.authenticate("access-token", { session: false }),
    articleController.patchArticle
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    articleController.deleteArticle
  );

articleRouter.use("/:articleId/comments", articleCommentRouter);
articleRouter.use("/:articleId/like", likeRouter);

export default articleRouter;
