// src/services/notification_service.ts
import { Server } from 'socket.io';
import { prisma } from '../lib/prisma';

let io: Server;

export const setSocketIoInstance = (socketIoInstance: Server) => {
    io = socketIoInstance;
};

export interface CreateNotificationDto {
    userId: number;
    type: 'PRICE_CHANGE' | 'NEW_COMMENT';
    title: string;
    message: string;
    relatedId?: number;
    relatedType?: 'PRODUCT' | 'POST';
}

class NotificationService {
    async createNotification(data: CreateNotificationDto) {
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                relatedId: data.relatedId,
                relatedType: data.relatedType,
            },
        });
        if (io) {
            io.to(String(data.userId)).emit('notification', notification);
        } else {
            console.warn('[NotificationService] Socket.IO instance has not been set.');
        }

        return notification;
    }

    async getNotifications(userId: number, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count({ where: { userId } }),
        ]);

        return {
            notifications,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getUnreadCount(userId: number) {
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        return count;
    }

    async markAsRead(notificationId: number, userId: number) {
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });

        if (!notification) {
            throw new Error('알림을 찾을 수 없습니다.');
        }

        const updated = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return updated;
    }

    async markAllAsRead(userId: number) {
        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: { isRead: true },
        });

        return { success: true };
    }

    async notifyPriceChange(productId: number, oldPrice: number, newPrice: number) {
        const likes = await prisma.productLike.findMany({
            where: { productId },
            include: {
                product: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        const notifications = likes.map((like: { userId: number; product: { title: string } }) =>
            this.createNotification({
                userId: like.userId,
                type: 'PRICE_CHANGE',
                title: '가격 변동 알림',
                message: `좋아요한 상품 "${like.product.title}"의 가격이 ${oldPrice.toLocaleString()}원에서 ${newPrice.toLocaleString()}원으로 변경되었습니다.`,
                relatedId: productId,
                relatedType: 'PRODUCT',
            })
        );

        await Promise.all(notifications);
        return { notifiedUsers: likes.length };
    }

    async notifyNewComment(postId: number, commentAuthorId: number, commentContent: string) {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                authorId: true,
                title: true,
            },
        });

        if (!post) {
            throw new Error('게시글을 찾을 수 없습니다.');
        }

        if (post.authorId === commentAuthorId) {
            return { notified: false };
        }

        const commentAuthor = await prisma.user.findUnique({
            where: { id: commentAuthorId },
            select: { nickname: true },
        });

        await this.createNotification({
            userId: post.authorId,
            type: 'NEW_COMMENT',
            title: '새 댓글 알림',
            message: `${commentAuthor?.nickname || '사용자'}님이 "${post.title}" 게시글에 댓글을 남겼습니다: "${commentContent.slice(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
            relatedId: postId,
            relatedType: 'POST',
        });

        return { notified: true };
    }
}

export default new NotificationService();