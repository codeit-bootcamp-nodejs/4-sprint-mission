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
} from "../middleware/articleCommentValidation.js";

const router = express.Router();

//게시글
router.get(
  "/articles/:id/comments",
  validateArticleCommentParams,
  validateArticleCommentQuery,
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
  validateArticleCommentBody,
  validateArticleCommentParams,
  createArticleCommentController
);
router.patch(
  "/articles/:id/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentBody,
  validateArticleCommentParams,
  updateArticleCommentController
);
router.delete(
  "/articles/:id/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateArticleCommentParams,
  deleteArticleCommentController
);

export default router;
