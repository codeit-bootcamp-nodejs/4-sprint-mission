import { Router } from 'express';
import ArticlesController from '../controllers/ArticlesController';
import ArticleService from '../ArticleService';
import ArticleRepository from '../repositories/ArticleRepository';
import authMiddleware from '../middlewares/auth.middleware';
import optionalAuthMiddleware from '../middlewares/optionalAuth.middleware';
import { validateArticle } from '../middlewares/validation.middleware';

const router = Router();

// Initialize repositories and services
const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);
const articlesController = new ArticlesController(articleService);

//article registration
router
  .route('/articles')
  .post(authMiddleware, validateArticle, articlesController.createArticle)
  // 게시글 목록 조회
  .get(optionalAuthMiddleware, articlesController.getArticles);

// article detail, modify, delete
router
  .route('/articles/:articleId')
  .get(optionalAuthMiddleware, articlesController.getArticleById)
  .patch(authMiddleware, validateArticle, articlesController.updateArticle)
  .delete(authMiddleware, articlesController.deleteArticle);

// article comment creation
router.post('/articles/:articleId/comments', authMiddleware, articlesController.createComment);

// article comments check
router.get('/articles/:articleId/comments', articlesController.getComments);

//article comment modify
router.patch('/articles/comments/:commentId', authMiddleware, articlesController.updateComment);

//article comment delete
router.delete('/articles/comments/:commentId', authMiddleware, articlesController.deleteComment);

// 게시글 좋아요 API
router.post('/:articleId/like', authMiddleware, articlesController.toggleLike);

export default router;
