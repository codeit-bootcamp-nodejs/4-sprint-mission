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

const router = express.Router();

//게시글
router.get(
  "/articles/:id/comments",
  validateArticleCommentParamsAndQuery,
  listArticleCommentController
);
router.get(
  "/articles/:id/comments/:commentId",
  validateArticleCommentParams,
  getArticleCommentByIdController
);

router.post(
  "/articles/:id/comments",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentBodyAndParams,
  createArticleCommentController
);
router.patch(
  "/articles/:id/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentBodyAndParams,
  updateArticleCommentController
);
router.delete(
  "/articles/:id/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentParams,
  deleteArticleCommentController
);

export default router;
