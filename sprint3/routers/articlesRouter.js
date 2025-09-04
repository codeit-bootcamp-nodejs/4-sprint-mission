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

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(validateArticleQuery, getArticleList)
  .post(validateArticleCreate, postArticle);

articleRouter
  .route("/:id")
  .get(validateId, getArticleById)
  .patch(validateId, patchArticle)
  .delete(validateId, deleteArticle);

articleRouter.use("/:articleId/comments", articleCommentRouter);

export default articleRouter;
