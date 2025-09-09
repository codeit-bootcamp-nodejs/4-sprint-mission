import express from 'express';
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
} from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, createProduct); // 등록
router.get('/:id', getProductById);            // 상세 조회
router.patch('/:id', authenticate, updateProduct); // 수정
router.delete('/:id', authenticate, deleteProduct); // 삭제
router.get('/', getProducts);                  // 목록 조회

export default router;
