import express from 'express';
import { articleCommentController } from '../controllers/article-cmt-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isCommentOwner } from '../middlewares/authorize.js';

const router = express.Router();

router
  .route('/:articleId/comments')
  .get(articleCommentController.getComments)
  .post(authenticate, articleCommentController.createComment);

router
  .route('/comments/:commentId')
  .patch(
    authenticate,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    articleCommentController.updateComment
  )
  .delete(
    authenticate,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    articleCommentController.deleteComment
  );

router
  .route('/comments/:commentId/like')
  .post(
    authenticate,
    validation.validateParam('commentId', validation.idSchema),
    articleCommentController.likeComment
  )
  .delete(
    authenticate,
    validation.validateParam('commentId', validation.idSchema),
    articleCommentController.unlikeComment
  );

export default router;
