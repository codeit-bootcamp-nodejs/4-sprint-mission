import prisma from '../../utils/prisma.js';
import type { CreateNotificationDto } from './notification.type.js';

class NotificationRepository {
  list = async (userId: number) => {
    return await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  };

  unreadCount = async () => {
    return await prisma.notification.count({
      where: { isRead: false },
    });
  };

  read = async (notificationIds: number[]) => {
    return await prisma.notification.updateMany({
      where: { id: { in: notificationIds } },
      data: { isRead: true },
    });
  };

  create = async (data: CreateNotificationDto) => {
    return await prisma.notification.create({
      data: {
        type: data.type,
        message: data.message,
        user: {
          connect: { id: data.userId },
        },
      },
    });
  };
}

export const notificationRepository = new NotificationRepository();
