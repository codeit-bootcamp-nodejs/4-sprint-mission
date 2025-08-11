import express from 'express';
import articleController from '../controllers/articleController';
import articleValidation from '../middleware/articleValidation';

const router = express.Router();

router
  .route('/')
  .post(articleValidation, articleController.createArticle)
  .get(articleController.listArticle);

router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(articleValidation, articleController.updateArticle)
  .delete(articleController.deleteArticle);

export default router;
