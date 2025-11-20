import UnauthorizedError from '../lib/errors/UnauthorizedError';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CursorPaginationParams } from '../types/pagination';
import { Notification } from '../types/Notification';
import * as notificationsRepository from '../repositories/notificationsRepository';
import * as usersRepository from '../repositories/usersRepository';
import socketService from './socketService';

export async function createNotification(
  data: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt'>,
) {
  const existingUser = await usersRepository.getUser(data.userId);
  if (!existingUser) {
    throw new NotFoundError('User', data.userId);
  }

  const notification = await notificationsRepository.createNotification({
    ...data,
    read: false,
  });

  socketService.sendNotification(notification as Notification);

  return notification;
}

export async function createNotifications(
  notifications: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt'>[],
) {
  await notificationsRepository.createNotifications(
    notifications.map((notification) => ({
      ...notification,
      read: false,
    })),
  );

  notifications.forEach((notification) => {
    socketService.sendNotification(notification as Notification);
  });
}

export async function readNotificationById(id: number, userId?: number) {
  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const notification = await notificationsRepository.getNotificationById(id);
  if (!notification) {
    throw new NotFoundError('Notification', id);
  }

  if (notification.userId !== userId) {
    throw new ForbiddenError("Cannot read other user's notification");
  }

  await notificationsRepository.updateNotificationById(id, { read: true });
}

export async function getMyNotifications(userId: number, params: CursorPaginationParams) {
  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { cursor, limit } = params;
  const { notifications, totalCount, unreadCount, nextCursor } =
    await notificationsRepository.getNotificationsByUserId(userId, { cursor, limit });
  return { list: notifications, totalCount, unreadCount, nextCursor };
}
