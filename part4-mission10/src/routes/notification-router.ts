import { Router } from 'express';

import { notificationController } from '../controllers/notification-controller.js';
import { accessAuth } from '../lib/passport/index.js';
import { validation } from '../middlewares/validation.js';

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
  validation.validateParam('notificationId', validation.idSchema),
  notificationController.markAsRead
);
router.patch('/read-all', accessAuth, notificationController.markAllAsRead);

export default router;
