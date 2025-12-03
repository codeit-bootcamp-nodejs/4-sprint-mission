import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateNotificationData } from '../types/notification.js';

type PrismaTransaction = Prisma.TransactionClient;

/** 알림 생성 */
export const createNotification = async (
    data: CreateNotificationData,
    tx: PrismaTransaction = prisma
) => {
    return tx.notification.create({
        data,
    });
};

/** 사용자의 알림 목록 조회 */
export const findNotificationsByUserId = async (
    userId: number,
    limit: number = 20,
    offset: number = 0,
    tx: PrismaTransaction = prisma
) => {
    return tx.notification.findMany({
        where: { userId },
        include: {
            product: {
                select: { id: true, name: true },
            },
            post: {
                select: { id: true, title: true },
            },
            comment: {
                select: { id: true, content: true },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
    });
};

/** 안 읽은 알림 개수 조회 */
export const countUnreadNotifications = async (
    userId: number,
    tx: PrismaTransaction = prisma
) => {
    return tx.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
};

/** 알림 읽음 처리 */
export const markNotificationAsRead = async (
    notificationId: number,
    tx: PrismaTransaction = prisma
) => {
    return tx.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
};

/** 특정 알림 조회 */
export const findNotificationById = async (
    notificationId: number,
    tx: PrismaTransaction = prisma
) => {
    return tx.notification.findUnique({
        where: { id: notificationId },
    });
};

/** 모든 알림 읽음 처리 */
export const markAllNotificationsAsRead = async (
    userId: number,
    tx: PrismaTransaction = prisma
) => {
    return tx.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: { isRead: true },
    });
};
