import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationsController';
import authenticate from '../middlewares/authenticate';

const notificationsRouter = express.Router();

// 모든 라우트는 JWT 인증 필요
notificationsRouter.get('/', authenticate(), withAsync(getNotifications));
notificationsRouter.get('/unread-count', authenticate(), withAsync(getUnreadCount));
notificationsRouter.put('/:id/read', authenticate(), withAsync(markAsRead));
notificationsRouter.put('/read-all', authenticate(), withAsync(markAllAsRead));

export default notificationsRouter;
