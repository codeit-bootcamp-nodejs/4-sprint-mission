import express from 'express';
import { productCommentController } from '../controllers/product-cmt-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isCommentOwner } from '../middlewares/authorize.js';
const router = express.Router();
// 상품 댓글 조회, 작성
router
    .route('/:productId/comments')
    .get(productCommentController.getComments)
    .post(authenticate, validation.validate(validation.commentSchema), productCommentController.createComment);
// 상품 댓글 수정, 삭제
router
    .route('/comments/:commentId')
    .patch(authenticate, validation.validateParam('commentId', validation.idSchema), isCommentOwner, validation.validate(validation.commentSchema), productCommentController.updateComment)
    .delete(authenticate, validation.validateParam('commentId', validation.idSchema), isCommentOwner, productCommentController.deleteComment);
// 상품 댓글 좋아요, 좋아요 취소
router
    .route('/comments/:commentId/like')
    .post(authenticate, validation.validateParam('commentId', validation.idSchema), productCommentController.likeComment)
    .delete(authenticate, validation.validateParam('commentId', validation.idSchema), productCommentController.unlikeComment);
export default router;
//# sourceMappingURL=product-cmt-router.js.map