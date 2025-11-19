import { Request, Response } from 'express';
import * as notificationsService from '../services/notificationsService';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

/** 알림 목록 조회 */
export async function getNotifications(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  const notifications = await notificationsService.getNotifications(req.user.id, limit, offset);

  res.send(notifications);
}

/** 안 읽은 알림 개수 조회 */
export async function getUnreadCount(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const unreadCount = await notificationsService.getUnreadCount(req.user.id);

  res.send({ unreadCount });
}

/** 알림 읽음 처리 */
export async function markAsRead(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const notificationId = parseInt(req.params.id);

  if (isNaN(notificationId)) {
    throw new Error('Invalid notification ID');
  }

  const notification = await notificationsService.markAsRead(notificationId, req.user.id);

  res.send(notification);
}

/** 모든 알림 읽음 처리 */
export async function markAllAsRead(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  await notificationsService.markAllAsRead(req.user.id);

  res.status(204).send();
}
