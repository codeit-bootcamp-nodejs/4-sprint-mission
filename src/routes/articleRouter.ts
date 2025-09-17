import express from "express";
import passport from "passport";
import {
  createArticleController,
  getArticleByIdController,
  updateArticleController,
  deleteArticleController,
  listArticleController,
  toggleArticleLikeController,
} from "../controllers/articleController.js";
import {
  validateArticleBody,
  validateArticleParams,
  validateArticleQuery,
  validateArticleBodyAndParams,
} from "../middlewares/articleValidation.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { withTypedHandler } from "../lib/typedRequestHandler.js";
import type {
  ArticleBodyDto,
  ArticleParamsDto,
  ArticleQueryDto,
} from "../dto/request/article.request.dto.js";

const router = express.Router();

router.get(
  "/",
  validateArticleQuery,
  withTypedHandler<unknown, unknown, unknown, ArticleQueryDto>(
    listArticleController
  )
);

router.get(
  "/:id",
  optionalAuth,
  validateArticleParams,
  withTypedHandler<ArticleParamsDto>(getArticleByIdController)
);

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  validateArticleBody,
  withTypedHandler<unknown, unknown, ArticleBodyDto>(createArticleController)
);
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  validateArticleBodyAndParams,
  withTypedHandler<ArticleParamsDto, unknown, ArticleBodyDto>(
    updateArticleController
  )
);
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  validateArticleParams,
  withTypedHandler<ArticleParamsDto>(deleteArticleController)
);

// 특정 게시글 좋아요 / 좋아요 취소
router.post(
  "/:id/like",
  passport.authenticate("access-token", { session: false }),
  validateArticleParams,
  withTypedHandler<ArticleParamsDto>(toggleArticleLikeController)
);

export default router;
