import { notificationRepository } from "../repositories/notificationRepository.js";

export const notificationService = {
  getNotificationsByUser: async (userId: number) => {
    const notifications = await notificationRepository.getNotificationsByUser(
      userId
    );

    if (!notifications || notifications.length === 0) {
      const error: HttpError = new Error("알림이 존재하지 않습니다.");
      error.status = 404;
      throw error;
    }

    return notifications;
  },

  getUnreadCount: async (userId: number) => {
    return await notificationRepository.getUnreadCount(userId);
  },

  markAsRead: async (userId: number, notificationId: number) => {
    const notification = await notificationRepository.markAsRead(
      userId,
      notificationId
    );

    if (!notification) {
      const error: HttpError = new Error("해당 알림을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    return notification;
  },
};
