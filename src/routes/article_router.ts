import express from "express";
import {
  getArticleController,
  getArticleByIdController,
  createArticleController,
  updateArticleController,
  deleteArticleController,
} from "../controllers/article_controller";
import * as Validate from "../middleware/validate";
import authenticate from "../middleware/authenticate";

import {
  getArticleCommentController,
  updateCommentController,
  createArticleCommentController,
  deleteCommentController,
} from "../controllers/comment_controller";

import { ArticleLikeController } from "../controllers/like_controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getArticleController)
  .post(authenticate, Validate.validateArticle, createArticleController);
router
  .route("/:id")
  .get(authenticate, getArticleByIdController)
  .patch(authenticate, updateArticleController)
  .delete(authenticate, deleteArticleController);

router.post("/:id/like", authenticate, ArticleLikeController);

router
  .route("/:id/comment")
  .get(getArticleCommentController)
  .post(authenticate, Validate.validateContent, createArticleCommentController);
router
  .route("/:id/comment/:commentId")
  .patch(authenticate, updateCommentController)
  .delete(authenticate, deleteCommentController);

export default router;
