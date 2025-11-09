import { Router } from 'express';
import passport from '../config/passport.js';
import * as notificationController from '../controllers/notificationController.js';

const router = Router();

// 모든 라우트는 JWT 인증 필요
const authenticate = passport.authenticate('accessToken', { session: false });

// GET /notifications - 알림 목록 조회
router.get('/', authenticate, notificationController.getNotifications);

// GET /notifications/unread-count - 안 읽은 알림 개수 조회
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

// PUT /notifications/:id/read - 특정 알림 읽음 처리
router.put('/:id/read', authenticate, notificationController.markAsRead);

// PUT /notifications/read-all - 모든 알림 읽음 처리
router.put('/read-all', authenticate, notificationController.markAllAsRead);

export default router;
