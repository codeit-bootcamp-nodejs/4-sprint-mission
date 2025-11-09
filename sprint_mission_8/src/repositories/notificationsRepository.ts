import { prismaClient } from '../lib/prismaClient';
import { CreateNotificationData } from '../types/Notification';

/** 알림 생성 */
export async function createNotification(data: CreateNotificationData) {
  return prismaClient.notification.create({
    data: {
      type: data.type,
      message: data.message,
      userId: data.userId,
      productId: data.productId ?? null,
      articleId: data.articleId ?? null,
      commentId: data.commentId ?? null,
    },
  });
}

/** 사용자의 알림 목록 조회 */
export async function getNotificationsByUserId(
  userId: number,
  limit: number = 20,
  offset: number = 0
) {
  return prismaClient.notification.findMany({
    where: { userId },
    include: {
      product: {
        select: { id: true, name: true },
      },
      article: {
        select: { id: true, title: true },
      },
      comment: {
        select: { id: true, content: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

/** 안 읽은 알림 개수 조회 */
export async function countUnreadNotifications(userId: number) {
  return prismaClient.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

/** 알림 읽음 처리 */
export async function markNotificationAsRead(notificationId: number) {
  return prismaClient.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

/** 특정 알림 조회 */
export async function getNotification(notificationId: number) {
  return prismaClient.notification.findUnique({
    where: { id: notificationId },
  });
}

/** 모든 알림 읽음 처리 */
export async function markAllNotificationsAsRead(userId: number) {
  return prismaClient.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });
}
