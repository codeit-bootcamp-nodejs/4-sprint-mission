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

const router = express.Router();

router.get("/", validateArticleQuery, listArticleController);

router.get(
  "/:id",
  optionalAuth,
  validateArticleParams,
  getArticleByIdController
);

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  validateArticleBody,
  createArticleController
);
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  validateArticleBodyAndParams,
  updateArticleController
);
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  validateArticleParams,
  deleteArticleController
);

// 특정 게시글 좋아요 / 좋아요 취소
router.post(
  "/:id/like",
  passport.authenticate("access-token", { session: false }),
  validateArticleParams,
  toggleArticleLikeController
);

export default router;
