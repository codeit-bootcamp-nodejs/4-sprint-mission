import express from 'express';
import { 
  getMyProfile,
  updateMyProfile,
  updateProfileValidation,
  changePassword,
  changePasswordValidation,
  getMyProducts,
  getMyLikedProducts
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 내 정보 조회
router.get('/me', authenticateToken, getMyProfile);

// 내 정보 수정
router.put('/me', authenticateToken, updateProfileValidation, updateMyProfile);

// 비밀번호 변경
router.put('/me/password', authenticateToken, changePasswordValidation, changePassword);

// 내가 등록한 상품 목록
router.get('/me/products', authenticateToken, getMyProducts);

// 내가 좋아요한 상품 목록
router.get('/me/liked-products', authenticateToken, getMyLikedProducts);

export default router;