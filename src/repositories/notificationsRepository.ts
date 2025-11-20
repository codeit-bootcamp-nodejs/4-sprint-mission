import { prismaClient } from '../lib/prismaClient';
import { Notification } from '../types/Notification';
import { CursorPaginationParams } from '../types/pagination';

export async function getNotificationsByUserId(userId: number, params: CursorPaginationParams) {
  const { cursor, limit } = params;
  const where = {
    userId,
  };
  const notificationsWithCursor = await prismaClient.notification.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
  const totalCount = await prismaClient.notification.count({ where });
  const unreadCount = await prismaClient.notification.count({ where: { ...where, read: false } });
  const notifications = notificationsWithCursor.slice(0, limit);
  const cursorNotification = notificationsWithCursor[notificationsWithCursor.length - 1];
  const nextCursor = cursorNotification ? cursorNotification.id : null;
  return { notifications, totalCount, unreadCount, nextCursor };
}

export async function createNotification(
  data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const notification = await prismaClient.notification.create({
    data,
  });
  return notification;
}

export async function createNotifications(
  data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>[],
) {
  await prismaClient.notification.createMany({
    data,
  });
}

export async function getNotificationById(id: number) {
  const notification = await prismaClient.notification.findUnique({
    where: { id },
  });
  return notification;
}

export async function updateNotificationById(id: number, data: Partial<Notification>) {
  await prismaClient.notification.update({
    where: { id },
    data,
  });
}

export async function updateNotificationsByUserId(userId: number, data: Partial<Notification>) {
  await prismaClient.notification.updateMany({
    where: { userId },
    data,
  });
}
