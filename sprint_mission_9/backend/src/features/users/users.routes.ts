import { Router } from 'express';
import { authenticateToken } from '../../shared/middlewares/auth.middleware';
import {
  register,
  login,
  refreshToken,
  getMe,
  updateMe,
  deleteMe,
} from './users.controller';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.patch('/me', authenticateToken, updateMe);
router.delete('/me', authenticateToken, deleteMe);

export default router;
