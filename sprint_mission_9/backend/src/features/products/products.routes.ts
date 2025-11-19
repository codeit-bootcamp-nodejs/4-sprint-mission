import { Router } from 'express';
import { authenticateToken } from '../../shared/middlewares/auth.middleware';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleLike,
} from './products.controller';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', authenticateToken, createProduct);
router.patch('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);
router.post('/:id/like', authenticateToken, toggleLike);

export default router;
