import { prisma } from '../utils/prisma.util.js';
export class NotificationsRepository {
    constructor() {
        this.createNotification = async (recipientId, type, message, relatedProductId, relatedArticleId) => {
            return await prisma.notification.create({
                data: {
                    recipientId,
                    type,
                    message,
                    relatedProductId,
                    relatedArticleId,
                },
            });
        };
        this.findNotificationsByUserId = async (userId) => {
            return await prisma.notification.findMany({
                where: { recipientId: userId },
                orderBy: { createdAt: 'desc' },
            });
        };
        this.countUnreadNotifications = async (userId) => {
            return await prisma.notification.count({
                where: { recipientId: userId, isRead: false },
            });
        };
        this.markNotificationAsRead = async (notificationId, userId) => {
            return await prisma.notification.update({
                where: { id: notificationId, recipientId: userId },
                data: { isRead: true },
            });
        };
        this.markAllNotificationsAsRead = async (userId) => {
            return await prisma.notification.updateMany({
                where: { recipientId: userId, isRead: false },
                data: { isRead: true },
            });
        };
    }
}
