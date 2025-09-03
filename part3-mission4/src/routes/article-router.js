import express from 'express';
import { articleController } from '../controllers/article-controller.js';
import { validation } from '../middlewares/validation.js';

const router = express.Router();

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(validation.validateArticleData, articleController.createArticle);

router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

export default router;
