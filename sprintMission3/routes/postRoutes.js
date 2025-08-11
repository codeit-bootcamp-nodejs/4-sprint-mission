import express from 'express';
import upload from '../middlewares/uploads.js';
import { createPost, deleteArticleLike } from '../controller/postController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// 게시글 생성 (이미지 업로드 포함)
router.post('/', verifyToken, upload.single('image'), createPost);

// 게시글 좋아요 삭제
router.delete('/articles/:articleId/likes', verifyToken, deleteArticleLike);

export default router;