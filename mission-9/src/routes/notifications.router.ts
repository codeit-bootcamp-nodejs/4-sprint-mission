import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { NotificationsController } from '../controllers/notifications.controller.js';

const router = express.Router();
const notificationsController = new NotificationsController();

// 알림 목록 조회
router.get('/notifications', authMiddleware, notificationsController.getNotifications);

// 안 읽은 알림 개수 조회
router.get('/notifications/unread/count', authMiddleware, notificationsController.getUnreadNotificationCount);

// 알림 읽음 처리
router.patch('/notifications/:notificationId/read', authMiddleware, notificationsController.markNotificationAsRead);

// 모든 알림 읽음 처리
router.patch('/notifications/read-all', authMiddleware, notificationsController.markAllNotificationsAsRead);

export default router;
