import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { CommentsController } from '../controllers/comments.controller.js';
const router = express.Router();
const commentsController = new CommentsController();
// 댓글 생성 (게시글)
router.post('/articles/:articleId/comments', authMiddleware, commentsController.createArticleComment);
// 댓글 생성 (상품)
router.post('/products/:productId/comments', authMiddleware, commentsController.createProductComment);
// 댓글 조회 (게시글)
router.get('/articles/:articleId/comments', commentsController.getArticleComments);
// 댓글 조회 (상품)
router.get('/products/:productId/comments', commentsController.getProductComments);
// 댓글 수정
router.put('/comments/:commentId', authMiddleware, commentsController.updateComment);
// 댓글 삭제
router.delete('/comments/:commentId', authMiddleware, commentsController.deleteComment);
export default router;
