import express from 'express';
import commentRouter from './comment.route.js';

const articleRouter = (
  articleController,
  commentController,
  validationMiddleware,
) => {
  const router = express.Router();

  router
    .route('/')
    .post(validationMiddleware.validateArticle, articleController.createArticle)
    .get(articleController.getArticles);

  router
    .route('/:id')
    .get(validationMiddleware.validateId, articleController.getArticleById)
    .patch(
      [validationMiddleware.validateId, validationMiddleware.validateArticle],
      articleController.updateArticle,
    )
    .delete(validationMiddleware.validateId, articleController.deleteArticle);

  const commentsRouter = commentRouter(commentController, validationMiddleware);
  router.use('/:id/comments', commentsRouter);

  return router;
};

export default articleRouter;
