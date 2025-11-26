import { prisma } from '../utils/prisma.util.js';
import { NotificationType, Prisma } from '@prisma/client';

export class NotificationsRepository {
  createNotification = async (
    recipientId: number,
    type: NotificationType,
    message: string,
    relatedProductId?: number,
    relatedArticleId?: number,
  ) => {
    return await prisma.notification.create({
      data: {
        recipientId,
        type,
        message,
        relatedProductId,
        relatedArticleId,
      },
    });
  };

  findNotificationsByUserId = async (userId: number) => {
    return await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
    });
  };

  countUnreadNotifications = async (userId: number) => {
    return await prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    });
  };

  markNotificationAsRead = async (notificationId: number, userId: number) => {
    return await prisma.notification.update({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true },
    });
  };

  markAllNotificationsAsRead = async (userId: number) => {
    return await prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });
  };
}
