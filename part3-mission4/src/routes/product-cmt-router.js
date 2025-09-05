import express from 'express';
import { productCommentController } from '../controllers/product-cmt-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isCommentOwner } from '../middlewares/authorize.js';

const router = express.Router();

router
  .route('/:productId/comments')
  .get(productCommentController.getComments)
  .post(authenticate, productCommentController.createComment);

router
  .route('/comments/:commentId')
  .patch(
    authenticate,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    productCommentController.updateComment
  )
  .delete(
    authenticate,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    productCommentController.deleteComment
  );

router
  .route('/comments/:commentId/like')
  .post(
    authenticate,
    validation.validateParam('commentId', validation.idSchema),
    productCommentController.likeComment
  )
  .delete(
    authenticate,
    validation.validateParam('commentId', validation.idSchema),
    productCommentController.unlikeComment
  );

export default router;
