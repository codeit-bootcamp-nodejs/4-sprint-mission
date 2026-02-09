import type { Request, Response, NextFunction } from 'express';
import notificationService from '../services/notificationService.js';

async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.userId;
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
}

async function getUnreadCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.userId;
    const count = await notificationService.getUnreadNotificationCount(userId);
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
}

async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.userId;
    const notificationId = parseInt(req.params.id, 10);
    const notification = await notificationService.markNotificationAsRead(
      notificationId,
      userId
    );
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
}

async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.userId;
    await notificationService.markAllNotificationsAsRead(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
