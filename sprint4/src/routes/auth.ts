// src/routes/auth.ts
import express from 'express';
import * as authController from '../controllers/authController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// 인증이 필요하지 않은 엔드포인트
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// 인증이 필요한 엔드포인트
router.get('/me', authMiddleware, authController.getMyInfo);
router.put('/me', authMiddleware, authController.updateMyInfo);
router.put('/me/password', authMiddleware, authController.changePassword);

export default router;