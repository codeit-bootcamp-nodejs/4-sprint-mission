import express from 'express';
import { articleCommentController } from '../controllers/article-cmt-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isCommentOwner } from '../middlewares/authorize.js';
const router = express.Router();
router
    .route('/:articleId/comments')
    .get(articleCommentController.getComments)
    .post(authenticate, validation.validate(validation.commentSchema), articleCommentController.createComment);
// 댓글 수정, 삭제
router
    .route('/comments/:commentId')
    .patch(authenticate, isCommentOwner, validation.validateParam('commentId', validation.idSchema), validation.validate(validation.commentSchema), articleCommentController.updateComment)
    .delete(authenticate, isCommentOwner, validation.validateParam('commentId', validation.idSchema), articleCommentController.deleteComment);
// 게시글 댓글 좋아요
router
    .route('/comments/:commentId/like')
    .post(authenticate, validation.validateParam('commentId', validation.idSchema), articleCommentController.likeComment)
    .delete(authenticate, validation.validateParam('commentId', validation.idSchema), articleCommentController.unlikeComment);
export default router;
//# sourceMappingURL=article-cmt-router.js.map