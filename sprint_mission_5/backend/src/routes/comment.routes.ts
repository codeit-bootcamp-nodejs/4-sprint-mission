// src/routes/comment.routes.js
import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Product 댓글
router
  .route('/product/:productId')
  .post(authenticateToken, commentController.createProductComment)
  .get(commentController.getProductComments);

// Article 댓글
router
  .route('/article/:articleId')
  .post(authenticateToken, commentController.createArticleComment)
  .get(commentController.getArticleComments);

// 공통 댓글 수정/삭제
router
  .route('/:id')
  .patch(authenticateToken, commentController.updateComment)
  .delete(authenticateToken, commentController.deleteComment);

export default router;
