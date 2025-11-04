import prisma from "../lib/prismaClient";

export const notificationRepository = {
  async create(data: { userId: number; type: string; message: string; payload?: any }) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        payload: data.payload ?? undefined,
      },
    });
  },

  async findByUser(userId: number) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async countUnread(userId: number) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  },

  async markAsRead(notificationId: number) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },
};
