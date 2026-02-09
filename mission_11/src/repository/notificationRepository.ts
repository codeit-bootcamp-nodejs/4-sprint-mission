import prisma from '../lib/prisma.js';

async function create(
  userId: number,
  message: string,
  articleId?: number,
  productId?: number
) {
  return prisma.notification.create({
    data: {
      userId,
      message,
      articleId: articleId ?? null,
      productId: productId ?? null,
    },
  });
}

async function findManyByUserId(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

async function getUnreadCount(userId: number) {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
}

async function markAsRead(notificationId: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    throw new Error('인증되지 않음 접근 혹은 알림 ID가 존재하지 않음');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

async function markAllAsRead(userId: number) {
  return prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
}

export default {
  create,
  findManyByUserId,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
