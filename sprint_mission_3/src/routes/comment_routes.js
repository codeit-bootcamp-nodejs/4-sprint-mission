// src/routes/comment.routes.js
import express from 'express';
import * as commentController from '../controllers/comment_controller.js';

const router = express.Router();

// Product 댓글
router
  .route('/product/:productId')
  .post(commentController.createProductComment)
  .get(commentController.getProductComments);

// Article 댓글
router
  .route('/article/:articleId')
  .post(commentController.createArticleComment)
  .get(commentController.getArticleComments);

// 공통 댓글 수정/삭제
router
  .route('/:id')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

export default router;
