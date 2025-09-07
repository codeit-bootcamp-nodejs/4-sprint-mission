import express from "express";
import { getArticleController } from "../controllers/article/get_article_controller.js";
import { getArticleByIdController } from "../controllers/article/get_article_by_id_controller.js";
import { createArticleController } from "../controllers/article/create_article_controller.js";
import { updateArticleController } from "../controllers/article/update_article_controller.js";
import { deleteArticleController } from "../controllers/article/delete_article_controller.js";

import * as Validate from "../middleware/validate.js";
import authenticate from "../middleware/authenticate.js";

import { getArticleCommentController } from "../controllers/comment/get_comment_controller.js";
import { updateCommentController } from "../controllers/comment/update_comment_controller.js";
import { createArticleCommentController } from "../controllers/comment/create_comment_controller.js";
import { deleteCommentController } from "../controllers/comment/delete_comment_controller.js";

const router = express.Router();

router
  .route("/")
  .get(getArticleController)
  .post(authenticate, Validate.validateArticle, createArticleController);
router
  .route("/:id")
  .get(getArticleByIdController)
  .patch(authenticate, updateArticleController)
  .delete(authenticate, deleteArticleController);

router
  .route("/:id/comment")
  .get(getArticleCommentController)
  .post(authenticate, Validate.validateContent, createArticleCommentController);
router
  .route("/:id/comment/:commentId")
  .patch(authenticate, updateCommentController)
  .delete(authenticate, deleteCommentController);

export default router;
