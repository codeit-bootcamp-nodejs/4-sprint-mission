import express from "express";
import commentRouter from "./comment-router.js";
import { authMiddleware, authOptionalMiddleware } from "../middleware/index.js";
import { ArticleController } from "../controller/article-controller.js";
import { CommentController } from "../controller/comment-controller.js";
import { ValidationMiddleware } from "../middleware/validation-middleware.js";

const articleRouter = (
  articleController: ArticleController,
  commentController: CommentController,
  validationMiddleware: ValidationMiddleware
) => {
  const router = express.Router();

  router
    .route("/")
    .post(
      authMiddleware,
      validationMiddleware.validateArticle,
      articleController.createArticle
    )
    .get(authOptionalMiddleware, articleController.getArticles);

  router
    .route("/:id")
    .get(
      authOptionalMiddleware,
      validationMiddleware.validateId,
      articleController.getArticleById
    )
    .patch(
      authMiddleware,
      [validationMiddleware.validateId, validationMiddleware.validateArticle],
      articleController.updateArticle
    )
    .delete(
      authMiddleware,
      validationMiddleware.validateId,
      articleController.deleteArticle
    );

  const commentsRouter = commentRouter(commentController, validationMiddleware);
  router.use("/:articleId/comments", commentsRouter);
  router.post("/:id/like", authMiddleware, articleController.toggleLike);

  return router;
};

export default articleRouter;
