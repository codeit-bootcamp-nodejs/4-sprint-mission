import { NotificationsRepository } from '../repositories/notifications.repository.js';
export class NotificationsService {
    constructor() {
        this.notificationsRepository = new NotificationsRepository();
        this.createNotification = async (recipientId, type, message, relatedProductId, relatedArticleId) => {
            const notification = await this.notificationsRepository.createNotification(recipientId, type, message, relatedProductId, relatedArticleId);
            // Emit real-time notification
            if (this.io) {
                this.io.to(recipientId.toString()).emit('newNotification', notification);
            }
            return notification;
        };
        this.getNotifications = async (userId) => {
            return await this.notificationsRepository.findNotificationsByUserId(userId);
        };
        this.getUnreadNotificationCount = async (userId) => {
            return await this.notificationsRepository.countUnreadNotifications(userId);
        };
        this.markNotificationAsRead = async (notificationId, userId) => {
            const notification = await this.notificationsRepository.markNotificationAsRead(notificationId, userId);
            // Optionally, emit an update to the client
            if (this.io) {
                this.io.to(userId.toString()).emit('notificationUpdated', notification);
            }
            return notification;
        };
        this.markAllNotificationsAsRead = async (userId) => {
            await this.notificationsRepository.markAllNotificationsAsRead(userId);
            // Optionally, emit an update to the client
            if (this.io) {
                this.io.to(userId.toString()).emit('allNotificationsRead', { userId });
            }
            return { message: '모든 알림을 읽음 처리했습니다.' };
        };
    } // Private constructor
    static getInstance() {
        if (!NotificationsService.instance) {
            NotificationsService.instance = new NotificationsService();
        }
        return NotificationsService.instance;
    }
    setIo(io) {
        this.io = io;
    }
}
