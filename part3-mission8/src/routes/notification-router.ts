import { Router } from 'express';
import { notificationController } from '../controllers/notification-controller.js';
import { accessAuth } from '../lib/passport/index.js';

const router = Router();

router.get('/', accessAuth, notificationController.getMyNotifications);
router.get(
  '/unread-count',
  accessAuth,
  notificationController.getMyUnreadCount
);
router.patch(
  '/:notificationId/read',
  accessAuth,
  notificationController.markAsRead
);
router.patch('/read-all', accessAuth, notificationController.markAllAsRead);

export default router;
