import express from 'express';
import { 
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  postValidation
} from '../controllers/postController';
import { 
  createPostComment,
  getPostComments,
  commentValidation
} from '../controllers/commentController';
import {
  togglePostLike,
  getPostLikeStatus,
  getPostLikes
} from '../controllers/likeController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// 게시글 목록 조회 (로그인 선택적)
router.get('/', optionalAuth, getPosts);

// 게시글 상세 조회 (로그인 선택적)
router.get('/:id', optionalAuth, getPost);

// 게시글 생성 (로그인 필수)
router.post('/', authenticateToken, postValidation, createPost);

// 게시글 수정 (작성자만)
router.put('/:id', authenticateToken, postValidation, updatePost);

// 게시글 삭제 (작성자만)
router.delete('/:id', authenticateToken, deletePost);

// 게시글 댓글 목록 조회
router.get('/:id/comments', getPostComments);

// 게시글 댓글 생성 (로그인 필수)
router.post('/:id/comments', authenticateToken, commentValidation, createPostComment);

// 게시글 좋아요/취소 토글 (로그인 필수)
router.post('/:id/like', authenticateToken, togglePostLike);

// 게시글 좋아요 상태 조회 (로그인 필수)
router.get('/:id/like/status', authenticateToken, getPostLikeStatus);

// 게시글 좋아요한 사용자 목록 조회
router.get('/:id/likes', getPostLikes);

export default router;