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

//articles 수정, 삭제 라우트
router
  .route('/articles/:articleId')
  .get(ArticleService.getArticleById)
  .patch(auth.verifyAccessToken, auth.verifyUserRole, zod.PatchArticle, ArticleService.updateArticles)  
  .delete(auth.verifyAccessToken, auth.verifyUserRole, ArticleService.deleteArticles);

//articleComments 등록, 조회 라우트
router
  .route('/articles/:articleId/articleComments')
  .get(ArticleService.getArticleComments)
  .post(auth.verifyAccessToken, zod.ArticleComment, ArticleService.createArticleComment)

//articleComments 수정, 삭제 라우트
router
  .route('/articles/:articleId/articleComments/:articlecommentId')
  .patch(auth.verifyAccessToken, auth.verifyUserRole, zod.PatchArticleComment, ArticleService.updateArticleComment)
  .delete(auth.verifyAccessToken, auth.verifyUserRole, ArticleService.deleteArticleComment);

export default router;