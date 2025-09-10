import express from 'express';

const commentRouter = (commentController, validationMiddleware) => {
  const router = express.Router({ mergeParams: true });

  router
    .route('/')
    .post(commentController.createComment)
    .get(commentController.getComments);

  router
    .route('/:commentId')
    .patch(validationMiddleware.validateId, commentController.updateComment)
    .delete(validationMiddleware.validateId, commentController.deleteComment);

  return router;
};

export default commentRouter;
