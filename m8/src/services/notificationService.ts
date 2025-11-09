import prisma from '../config/prisma.js';
import * as notificationRepository from '../repositories/notificationRepository.js';
import { getIO } from '../config/socket.js';
import { CustomError } from '../middlewares/errorHandler.js';
import type { CreateNotificationData } from '../types/notification.js';

/** 알림 생성 및 실시간 전송 */
export const createAndSendNotification = async (data: CreateNotificationData) => {
    return prisma.$transaction(async (tx) => {
        const notification = await notificationRepository.createNotification(data, tx);

        try {
            const io = getIO();
            io.to(`user:${data.userId}`).emit('notification', {
                id: notification.id,
                type: notification.type,
                message: notification.message,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
            });
        } catch (error) {
            console.error('Failed to send real-time notification:', error);
        }

        return notification;
    });
};

/** 알림 목록 조회 */
export const getNotifications = async (
    userId: number,
    limit: number = 20,
    offset: number = 0
) => {
    return notificationRepository.findNotificationsByUserId(userId, limit, offset);
};

/** 안 읽은 알림 개수 조회 */
export const getUnreadCount = async (userId: number) => {
    return notificationRepository.countUnreadNotifications(userId);
};

/** 알림 읽음 처리 */
export const markAsRead = async (notificationId: number, userId: number) => {
    return prisma.$transaction(async (tx) => {
        const notification = await notificationRepository.findNotificationById(notificationId, tx);

        if (!notification) {
            throw new CustomError('알림을 찾을 수 없습니다.', 404);
        }

        if (notification.userId !== userId) {
            throw new CustomError('이 알림에 접근할 권한이 없습니다.', 403);
        }

        return notificationRepository.markNotificationAsRead(notificationId, tx);
    });
};

/** 모든 알림 읽음 처리 */
export const markAllAsRead = async (userId: number) => {
    return notificationRepository.markAllNotificationsAsRead(userId);
};
