import express from 'express';
import ArticleService from '../service/articles-service.js';
import auth from '../middleware/auth.js'
import zod from '../middleware/zod.js';


const router = express.Router();

//articles 등록, 조회 라우트
router
  .route('/articles')
  .post(auth.verifyAccessToken, zod.CreateArticle, ArticleService.createArticles)
  .get(ArticleService.getArticles);


router
  .route('/articles/:articleId')
  .get(ArticleService.getArticleById)
  .patch(auth.verifyAccessToken, auth.verifyUserRole, zod.PatchArticle, ArticleService.updateArticles)  
  .delete(ArticleService.deleteArticles);

//article comments 등록, 조회 라우트
router
  .route('/articles/:articleId/comments')
  .get(ArticleService.getArticleComments)
  .post(auth.verifyAccessToken, zod.ArticleComment, ArticleService.createArticleComment)

router
  .route('/articles/:articleId/comments/:commentId')
  .patch(zod.PatchArticleComment, ArticleService.updateArticleComment)
  .delete(ArticleService.deleteArticleComment);


export default router;