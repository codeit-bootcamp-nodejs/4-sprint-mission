import { prisma } from '../lib/prismaClient.js';
import { type NotificationCreateInput } from '../types/notification.js';

export const notificationRepository = {
  create(data: NotificationCreateInput) {
    return prisma.notification.create({
      data: {
        ...data,
        productId: data.productId ?? null,
        articleId: data.articleId ?? null,
        commentId: data.commentId ?? null,
      },
    });
  },

  findByUserId(userId: number) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  countUnread(userId: number) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  },

  markAsRead(userId: number, notificationId: number) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  },

  markAllAsRead(userId: number) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
