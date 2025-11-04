import { notificationRepository } from "../repositories/notification-repository";
import { getIO } from "../lib/socket";
import prisma from "../lib/prismaClient";
import { Prisma } from "@prisma/client";

export const notificationService = {
  async getNotifications(userId: number) {
    return await notificationRepository.findByUser(userId);
  },

  async getUnreadCount(userId: number) {
    return await notificationRepository.countUnread(userId);
  },

  async markAsRead(notificationId: number) {
    return await notificationRepository.markAsRead(notificationId);
  },

  async sendNotification(
    userId: number,
    type: string,
    message: string,
    payload?: Record<string, any>
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        payload: payload ? payload : Prisma.JsonNull, 
      },
    });

    const io = getIO();
    io.to(`user_${userId}`).emit("notification", notification); 

    return notification;
  },
};
