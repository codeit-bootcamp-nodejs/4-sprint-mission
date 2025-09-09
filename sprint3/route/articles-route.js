import express from 'express';
import ArticleService from '../service/articles-service.js';
import zod from '../zod.js';


const router = express.Router();

router
  .route('/articles')
  .post(zod.CreateArticle, ArticleService.createArticles)
  .get(ArticleService.getArticles);

router
  .route('/articles/:articleId')
  .get(ArticleService.getArticleById)
  .patch(zod.PatchArticle, ArticleService.updateArticles)  
  .delete(ArticleService.deleteArticles);

router
  .route('/articles/:articleId/comments')
  .get(ArticleService.getArticleComments)
  .post(zod.ArticleComment, ArticleService.createArticleComment)

router
  .route('/articles/:articleId/comments/:commentId')
  .patch(zod.PatchArticleComment, ArticleService.updateArticleComment)
  .delete(ArticleService.deleteArticleComment);


export default router;