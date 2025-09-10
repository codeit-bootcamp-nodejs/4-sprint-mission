import express from 'express';
import commentRouter from './comment.route.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const articleRouter = (
  articleController,
  commentController,
  validationMiddleware,
) => {
  const router = express.Router();

  router
    .route('/')
    .post(
      authMiddleware,
      validationMiddleware.validateArticle,
      articleController.createArticle,
    )
    .get(articleController.getArticles);

  router
    .route('/:id')
    .get(validationMiddleware.validateId, articleController.getArticleById)
    .patch(
      authMiddleware,
      [validationMiddleware.validateId, validationMiddleware.validateArticle],
      articleController.updateArticle,
    )
    .delete(
      authMiddleware,
      validationMiddleware.validateId,
      articleController.deleteArticle,
    );

  const commentsRouter = commentRouter(commentController, validationMiddleware);
  router.use('/:articleId/comments', commentsRouter);

  return router;
};

export default articleRouter;
