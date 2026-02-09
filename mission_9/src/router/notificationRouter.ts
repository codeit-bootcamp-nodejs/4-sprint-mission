import { Router } from 'express';
import notificationController from '../controller/notificationController.js';
import auth from '../middleware/auth.js';

const router = Router();

// 모든 알림을 받아옴
router.get(
  '/notifications',
  auth.verifyAccessToken,
  notificationController.getNotifications
);

// 알림 수를 받아옴
router.get(
  '/notifications/unread-count',
  auth.verifyAccessToken,
  notificationController.getUnreadCount
);

// 알림을 읽음으로 표시
router.patch(
  '/notifications/:id/read',
  auth.verifyAccessToken,
  notificationController.markAsRead
);

// 모든 알림을 읽음으로 표시
router.patch(
  '/notifications/read-all',
  auth.verifyAccessToken,
  notificationController.markAllAsRead
);

export default router;
