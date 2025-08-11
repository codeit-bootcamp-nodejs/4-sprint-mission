import express from 'express';
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from '../controllers/articles.controller.js';

const router = express.Router();

// '/articles' 경로에 대한 라우팅
router
  .route('/')
  .post(createArticle) // 게시글 등록
  .get(getArticles); // 게시글 목록 조회

// '/articles/:id' 경로에 대한 라우팅 (경로 중복 제거)
router
  .route('/:id')
  .get(getArticleById) // 게시글 상세 조회
  .patch(updateArticle) // 게시글 수정
  .delete(deleteArticle); // 게시글 삭제

export default router;
