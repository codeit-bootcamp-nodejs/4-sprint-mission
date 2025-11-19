import express from 'express';

import { productCommentController } from '../../controllers/comments/product-comment-controller.js';
import { accessAuth } from '../../lib/passport/index.js';
import { isCommentOwner } from '../../middlewares/authorize.js';
import { validation } from '../../middlewares/validation.js';

const router = express.Router();

// 상품 댓글 조회, 작성
router
  .route('/:productId/comments')
  .get(productCommentController.getComments)
  .post(
    accessAuth,
    validation.validate(validation.commentSchema),
    productCommentController.createComment
  );

// 상품 댓글 수정, 삭제
router
  .route('/comments/:commentId')
  .patch(
    accessAuth,
    validation.validateParam('commentId', validation.idSchema),
    isCommentOwner,
    validation.validate(validation.commentSchema),
    productCommentController.updateComment
  )
  .delete(
    accessAuth,
    validation.validateParam('commentId', validation.idSchema),
    isCommentOwner,
    productCommentController.deleteComment
  );

// 상품 댓글 좋아요, 좋아요 취소
router
  .route('/comments/:commentId/like')
  .post(
    accessAuth,
    validation.validateParam('commentId', validation.idSchema),
    productCommentController.likeComment
  )
  .delete(
    accessAuth,
    validation.validateParam('commentId', validation.idSchema),
    productCommentController.unlikeComment
  );

export default router;
