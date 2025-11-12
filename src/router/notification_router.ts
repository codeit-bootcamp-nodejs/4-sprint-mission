// src/routes/notification_router.ts
import { Router } from 'express';
import notificationController from '../controllers/notification_controller';
import { authenticate } from '../middlewares/auth_middleware';

const router = Router();

router.get('/', notificationController.getNotifications);

router.get('/unread-count', notificationController.getUnreadCount);

router.patch('/:id/read', notificationController.markAsRead);

router.patch('/read-all', notificationController.markAllAsRead);

export default router;