import type { Request, Response, NextFunction } from 'express';

import { notificationService } from '../services/notification-service.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

class NotificationController {
  async getMyNotifications(req: Request, res: Response, _next: NextFunction) {
    const { user } = req as AuthenticatedRequest;
    const list = await notificationService.getMyNotifications(user.id);
    res.json(list);
  }

  async getMyUnreadCount(req: Request, res: Response, _next: NextFunction) {
    const { user } = req as AuthenticatedRequest;
    const count = await notificationService.getMyUnreadCount(user.id);
    res.json({ unreadCount: count });
  }

  async markAsRead(req: Request, res: Response, _next: NextFunction) {
    const { user } = req as AuthenticatedRequest;
    const { notificationId } = req.params;
    await notificationService.markAsRead(user.id, Number(notificationId));
    res.status(204).end();
  }

  async markAllAsRead(req: Request, res: Response, _next: NextFunction) {
    const { user } = req as AuthenticatedRequest;
    await notificationService.markAllAsRead(user.id);
    res.status(204).end();
  }
}

export const notificationController = new NotificationController();
