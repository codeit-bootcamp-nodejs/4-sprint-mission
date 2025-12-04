import { HttpError } from "../middlewares/errorHandler.middleware.js";
import { prisma } from "../prisma/prisma.js";
import { sendNotificationToUser } from "../app.js";

// 알림 목록 조회
export async function getNotificationByUser(userId: number) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      Product: true,
      Post: true,
    },
  });
}

// 안 읽음 알림 개수 조회
export async function getUnreadCount(userId: number) {
  return await prisma.notification.count({
    where: { userId, isRead: false },
  });
}

// 단일 알림 읽음 처리
export async function markAsRead(notificationId: number, userId: number) {
  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { id: true, userId: true, isRead: true },
  });

  if (!notif) {
    throw new HttpError("알림을 찾을 수 없습니다.", 404);
  }
  if (notif.userId !== userId) {
    throw new HttpError("권한이 없습니다.", 403);
  }
  if (notif.isRead) return notif; // 이미 읽음이면 그대로 반환

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  }); 
}

// 전체 읽음 처리
export async function markAllAsRead(userId: number) {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

// 알림 생성
export async function createNotification({
  userId,
  type,
  message,
  productId = null,
  postId = null,
}: {
  userId: number;
  type: string;
  message: string;
  productId?: number | null;
  postId?: number | null;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      productId,
      postId,
    },
  });

  sendNotificationToUser(userId, notification);

  return notification
}
