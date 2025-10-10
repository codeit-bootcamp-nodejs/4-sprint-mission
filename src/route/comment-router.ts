import express from 'express';
import { authMiddleware } from '../middleware';
import { CommentController } from '../controller/comment-controller';
import { ValidationMiddleware } from '../middleware/validation-middleware';

const commentRouter = (
  commentController: CommentController,
  validationMiddleware: ValidationMiddleware,
) => {
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