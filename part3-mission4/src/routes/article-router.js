import express from 'express';
import { articleController } from '../controllers/articleController.js';
import { validateArticleData } from '../middlewares/validation.js';

const router = express.Router();

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(validateArticleData, articleController.createArticle);

router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

export default router;
