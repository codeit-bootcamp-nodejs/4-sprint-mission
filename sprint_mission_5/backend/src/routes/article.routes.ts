// src/routes/article.routes.js
import express from 'express';
import * as articleController from '../controllers/article.controller.js';
import {
  validateArticle,
  validateArticlePatch,
} from '../middlewares/validation.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .post(authenticateToken, validateArticle, articleController.createArticle)
  .get(optionalAuth, articleController.getAllArticles);

router
  .route('/:id')
  .get(optionalAuth, articleController.getArticleById)
  .patch(authenticateToken, validateArticlePatch, articleController.updateArticle)
  .delete(authenticateToken, articleController.deleteArticle);

router.post('/:id/like', authenticateToken, articleController.toggleArticleLike);

export default router;
