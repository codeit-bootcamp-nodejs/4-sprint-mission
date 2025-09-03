import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/ProductController.js';

const router = express.Router();

// '/products' 경로에 대한 라우팅
router
  .route('/')
  .post(createProduct) // 상품 등록
  .get(getProducts); // 상품 목록 조회

// '/products/:id' 경로에 대한 라우팅 (경로 중복 제거)
router
  .route('/:id')
  .get(getProductById) // 상품 상세 조회
  .patch(updateProduct) // 상품 수정
  .delete(deleteProduct); // 상품 삭제

export default router;
