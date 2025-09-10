import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware.js';

const commentRouter = (commentController, validationMiddleware) => {
  const router = express.Router({ mergeParams: true });

  router
    .route('/')
    .post(authMiddleware, commentController.createComment)
    .get(commentController.getComments);

  router
    .route('/:commentId')
    .patch(
      authMiddleware,
      validationMiddleware.validateId,
      commentController.updateComment,
    )
    .delete(
      authMiddleware,
      validationMiddleware.validateId,
      commentController.deleteComment,
    );

  return router;
};

export default commentRouter;
