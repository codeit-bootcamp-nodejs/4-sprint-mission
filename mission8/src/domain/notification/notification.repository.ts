import prisma from '../../utils/prisma.js';
import type { CreateManyNotificationInput, CreateNotificationInput, GetListInput } from './notification.type.js';

class NotificationRepository {
  list = async (getListInput: GetListInput) => {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: getListInput.userId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (getListInput.page - 1) * getListInput.limit,
        take: getListInput.limit,
      }),
      prisma.notification.count({
        where: { userId: getListInput.userId },
      }),
    ]);

    return { notifications, total };
  };

  unreadCount = async (userId: number) => {
    return await prisma.notification.count({
      where: {
        isRead: false,
        userId,
      },
    });
  };

  read = async (notificationIds: number[], userId: number) => {
    return await prisma.notification.updateMany({
      where: { id: { in: notificationIds }, userId },
      data: { isRead: true },
    });
  };

  createMany = async (createManyData: CreateManyNotificationInput) => {
    return await prisma.notification.createMany({
      data: createManyData.userIds.map((userId) => ({
        type: createManyData.type,
        targetId: createManyData.targetId,
        targetType: createManyData.targetType,
        message: createManyData.message,
        userId,
      })),
    });
  };

  create = async (createData: CreateNotificationInput) => {
    return await prisma.notification.create({
      data: {
        userId: createData.userId,
        type: createData.type,
        targetId: createData.targetId,
        targetType: createData.targetType,
        message: createData.message,
      },
    });
  };
}

export const notificationRepository = new NotificationRepository();
