import express from 'express';
import { articleController } from '../controllers/article-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isArticleOwner } from '../middlewares/authorize.js';

const router = express.Router();

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(
    authenticate,
    validation.validateArticleData,
    articleController.createArticle
  );

router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(isArticleOwner, articleController.updateArticle)
  .delete(isArticleOwner, articleController.deleteArticle);

export default router;
