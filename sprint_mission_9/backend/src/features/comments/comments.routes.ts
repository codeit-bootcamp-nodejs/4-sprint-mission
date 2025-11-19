import { Router } from 'express';
import { authenticateToken } from '../../shared/middlewares/auth.middleware';
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from './comments.controller';

const router = Router();

// Public routes
router.get('/', getComments);
router.get('/:id', getCommentById);

// Protected routes
router.post('/', authenticateToken, createComment);
router.patch('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;
