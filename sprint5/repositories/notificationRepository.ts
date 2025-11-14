import prisma from "../lib/prisma.js";

interface CreateNotificationInput {
  userId: number;
  type: "PRICE_CHANGE" | "COMMENT";
  message: string;
  targetId: number;
}

export const notificationRepository = {
  // 🔹 알림 생성
  createNotification: async (data: CreateNotificationInput) => {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        targetId: data.targetId,
        isRead: false,
      },
    });
  },

  // 🔹 특정 유저의 알림 목록 조회
  getNotificationsByUser: async (userId: number) => {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔹 안 읽은 알림 개수 조회
  getUnreadCount: async (userId: number) => {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  },

  // 🔹 알림 읽음 처리
  markAsRead: async (userId: number, notificationId: number) => {
    return await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  },
};
