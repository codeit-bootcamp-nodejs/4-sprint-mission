import express from 'express';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateMiddleware } from '../../middleware/validate.middleware.js';
import { notificationController } from './notification.controller.js';
import { notificationSchema } from './notification.schema.js';

export const notificationRouter = express.Router();

notificationRouter.get('/', authMiddleware, validateMiddleware(notificationSchema.list), notificationController.list); // 알림 목록 조회
notificationRouter.get('/unread/count', authMiddleware, notificationController.unreadCount); // 안 읽은 알림 개수 조회
notificationRouter.patch(
  '/read',
  authMiddleware,
  validateMiddleware(notificationSchema.read),
  notificationController.read,
); // 알림 읽음 처리
