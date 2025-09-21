import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  getProfile, 
  updateProfile, 
  changePassword,
  getMyProducts,
  getMyLikedProducts,
  getMyArticles
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

router.get('/me', authenticateToken, getProfile);
router.patch('/me', authenticateToken, updateProfile);
router.patch('/me/password', authenticateToken, changePassword);
router.get('/me/products', authenticateToken, getMyProducts);
router.get('/me/liked-products', authenticateToken, getMyLikedProducts);
router.get('/me/articles', authenticateToken, getMyArticles);

export default router;