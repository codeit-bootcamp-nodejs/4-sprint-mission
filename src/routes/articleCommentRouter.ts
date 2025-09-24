import express from "express";
import passport from "../lib/passport/index.js";
import {
  createArticleCommentController,
  updateArticleCommentController,
  deleteArticleCommentController,
  listArticleCommentController,
  getArticleCommentByIdController,
} from "../controllers/articleCommentController.js";
import {
  validateArticleCommentBody,
  validateArticleCommentParams,
  validateArticleCommentQuery,
  validateArticleCommentParamsAndQuery,
  validateArticleCommentBodyAndParams,
} from "../middlewares/articleCommentValidation.js";
import { withTypedHandler } from "../lib/typedRequestHandler.js";
import type {
  ArticleCommentBodyDto,
  ArticleCommentParamsDto,
  ArticleCommentQueryDto,
} from "../dto/request/article-comment.request.dto.js";

const router = express.Router();

//게시글
router.get(
  "/articles/:articleId/comments",
  validateArticleCommentParamsAndQuery,
  withTypedHandler<
    ArticleCommentParamsDto,
    unknown,
    unknown,
    ArticleCommentQueryDto
  >(listArticleCommentController)
);
router.get(
  "/articles/:articleId/comments/:commentId",
  validateArticleCommentParams,
  withTypedHandler<ArticleCommentParamsDto>(getArticleCommentByIdController)
);

router.post(
  "/articles/:articleId/comments",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentBodyAndParams,
  withTypedHandler<ArticleCommentParamsDto, unknown, ArticleCommentBodyDto>(
    createArticleCommentController
  )
);
router.patch(
  "/articles/:articleId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentBodyAndParams,
  withTypedHandler<ArticleCommentParamsDto, unknown, ArticleCommentBodyDto>(
    updateArticleCommentController
  )
);
router.delete(
  "/articles/:articleId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentParams,
  withTypedHandler<ArticleCommentParamsDto>(deleteArticleCommentController)
);

export default router;
