import express from 'express';
import { articleCommentController } from '../controllers/comments/article-cmt-controller.js';
import { validation } from '../middlewares/validation.js';
import { isCommentOwner } from '../middlewares/authorize.js';
import { accessAuth } from '../lib/passport/index.js';

const router = express.Router();

router
  .route('/:articleId/comments')
  .get(articleCommentController.getComments)
  .post(
    accessAuth,
    validation.validate(validation.commentSchema),
    articleCommentController.createComment
  );

// 댓글 수정, 삭제
router
  .route('/comments/:commentId')
  .patch(
    accessAuth,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    validation.validate(validation.commentSchema),
    articleCommentController.updateComment
  )
  .delete(
    accessAuth,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    articleCommentController.deleteComment
  );

// 게시글 댓글 좋아요
router
  .route('/comments/:commentId/like')
  .post(
    accessAuth,
    validation.validateParam('commentId', validation.idSchema),
    articleCommentController.likeComment
  )
  .delete(
    accessAuth,
    validation.validateParam('commentId', validation.idSchema),
    articleCommentController.unlikeComment
  );

export default router;
