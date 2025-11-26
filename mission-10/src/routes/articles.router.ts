import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import optionalAuthMiddleware from '../middlewares/optional-auth.middleware.js';
import { ArticlesController } from '../controllers/articles.controller.js';

const router = express.Router();
const articlesController = new ArticlesController();

// 게시글 생성
router.post('/articles', authMiddleware, articlesController.createArticle);

// 게시글 목록 조회
router.get('/articles', articlesController.getArticles);

// 게시글 상세 조회
router.get('/articles/:articleId', optionalAuthMiddleware, articlesController.getArticleById);

// 게시글 수정
router.put('/articles/:articleId', authMiddleware, articlesController.updateArticle);

// 게시글 삭제 
router.delete('/articles/:articleId', authMiddleware, articlesController.deleteArticle);

/** 게시글 좋아요/좋아요 취소 **/
router.post('/articles/:articleId/like', authMiddleware, articlesController.toggleArticleLike);

export default router;
