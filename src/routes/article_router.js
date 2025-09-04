import express from "express";
import { getArticleController } from "../controllers/article/get_article_controller.js";
import { getArticleByIdController } from "../controllers/article/get_article_by_id_controller.js";
import { createArticleController } from "../controllers/article/create_article_controller.js";
import { updateArticleController } from "../controllers/article/update_article_controller.js";
import { deleteArticleController } from "../controllers/article/delete_article_controller.js";

import * as Validate from "../middleware/validate.js";

import { getCommentController } from "../controllers/comment/get_comment_controller.js";
import { updateCommentController } from "../controllers/comment/update_comment_controller.js";
import { createCommentController } from "../controllers/comment/create_comment_controller.js";
import { deleteCommentController } from "../controllers/comment/delete_comment_controller.js";

const router = express.Router();

router
  .route("/")
  .get(getArticleController)
  .post(Validate.validateArticle, createArticleController);
router
  .route("/:id")
  .get(getArticleByIdController)
  .patch(updateArticleController)
  .delete(deleteArticleController);

router
  .route("/:id/comment")
  .get(getCommentController)
  .post(Validate.validateContent, createCommentController);
router
  .route("/:id/comment/:commentId")
  .patch(updateCommentController)
  .delete(deleteCommentController);

export default router;
