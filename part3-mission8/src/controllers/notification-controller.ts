import { notificationService } from '../services/notification-service.js';
import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

export const notificationController = {
  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest;
      const list = await notificationService.getMyNotifications(user.id);
      res.json(list);
    } catch (e) {
      next(e);
    }
  },

  async getMyUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest;
      const count = await notificationService.getMyUnreadCount(user.id);
      res.json({ unreadCount: count });
    } catch (e) {
      next(e);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest;
      const { notificationId } = req.params;
      await notificationService.markAsRead(user.id, Number(notificationId));
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest;
      await notificationService.markAllAsRead(user.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
