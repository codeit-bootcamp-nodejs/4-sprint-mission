import express from 'express';
import { 
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productValidation
} from '../controllers/productController';
import { 
  createProductComment,
  getProductComments,
  commentValidation
} from '../controllers/commentController';
import {
  toggleProductLike,
  getProductLikeStatus,
  getProductLikes
} from '../controllers/likeController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// 상품 목록 조회 (로그인 선택적)
router.get('/', optionalAuth, getProducts);

// 상품 상세 조회 (로그인 선택적)
router.get('/:id', optionalAuth, getProduct);

// 상품 생성 (로그인 필수)
router.post('/', authenticateToken, productValidation, createProduct);

// 상품 수정 (작성자만)
router.put('/:id', authenticateToken, productValidation, updateProduct);

// 상품 삭제 (작성자만)
router.delete('/:id', authenticateToken, deleteProduct);

// 상품 댓글 목록 조회
router.get('/:id/comments', getProductComments);

// 상품 댓글 생성 (로그인 필수)
router.post('/:id/comments', authenticateToken, commentValidation, createProductComment);

// 상품 좋아요/취소 토글 (로그인 필수)
router.post('/:id/like', authenticateToken, toggleProductLike);

// 상품 좋아요 상태 조회 (로그인 필수)
router.get('/:id/like/status', authenticateToken, getProductLikeStatus);

// 상품 좋아요한 사용자 목록 조회
router.get('/:id/likes', getProductLikes);

export default router;