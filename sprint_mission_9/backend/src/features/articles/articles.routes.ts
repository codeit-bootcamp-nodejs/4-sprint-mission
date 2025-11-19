import { Router } from 'express';
import { authenticateToken } from '../../shared/middlewares/auth.middleware';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
} from './articles.controller';

const router = Router();

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Protected routes
router.post('/', authenticateToken, createArticle);
router.patch('/:id', authenticateToken, updateArticle);
router.delete('/:id', authenticateToken, deleteArticle);
router.post('/:id/like', authenticateToken, toggleLike);

export default router;
