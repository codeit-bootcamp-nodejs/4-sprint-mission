import { NotificationsRepository } from '../repositories/notifications.repository.js';
import { NotificationType } from '@prisma/client';
import { Server } from 'socket.io';

export class NotificationsService {
  private static instance: NotificationsService;
  notificationsRepository = new NotificationsRepository();

  // Socket.IO instance will be injected later
  private io!: Server;

  private constructor() {} // Private constructor

  public static getInstance(): NotificationsService { // Get singleton instance
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  setIo(io: Server) {
    this.io = io;
  }

  createNotification = async (
    recipientId: number,
    type: NotificationType,
    message: string,
    relatedProductId?: number,
    relatedArticleId?: number,
  ) => {
    const notification = await this.notificationsRepository.createNotification(
      recipientId,
      type,
      message,
      relatedProductId,
      relatedArticleId,
    );

    // Emit real-time notification
    if (this.io) {
      this.io.to(recipientId.toString()).emit('newNotification', notification);
    }

    return notification;
  };

  getNotifications = async (userId: number) => {
    return await this.notificationsRepository.findNotificationsByUserId(userId);
  };

  getUnreadNotificationCount = async (userId: number) => {
    return await this.notificationsRepository.countUnreadNotifications(userId);
  };

  markNotificationAsRead = async (notificationId: number, userId: number) => {
    const notification = await this.notificationsRepository.markNotificationAsRead(notificationId, userId);
    // Optionally, emit an update to the client
    if (this.io) {
      this.io.to(userId.toString()).emit('notificationUpdated', notification);
    }
    return notification;
  };

  markAllNotificationsAsRead = async (userId: number) => {
    await this.notificationsRepository.markAllNotificationsAsRead(userId);
    // Optionally, emit an update to the client
    if (this.io) {
      this.io.to(userId.toString()).emit('allNotificationsRead', { userId });
    }
    return { message: '모든 알림을 읽음 처리했습니다.' };
  };
}
