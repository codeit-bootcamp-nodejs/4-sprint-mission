import express from "express";
import {
  postArticle,
  getArticleList,
  getArticleById,
  patchArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import {
  validateArticleCreate,
  validateId,
  validateArticleQuery,
} from "../middlewares/validate.js";
import articleCommentRouter from "./articleCommentsRouter.js";
import passport from "../lib/passport/index.js";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(validateArticleQuery, getArticleList)
  .post(
    validateArticleCreate,
    passport.authenticate("access-token", { session: false }),
    postArticle
  );

articleRouter
  .route("/:id")
  .get(validateId, getArticleById)
  .patch(
    validateId,
    passport.authenticate("access-token", { session: false }),
    patchArticle
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    deleteArticle
  );

articleRouter.use("/:articleId/comments", articleCommentRouter);

export default articleRouter;
