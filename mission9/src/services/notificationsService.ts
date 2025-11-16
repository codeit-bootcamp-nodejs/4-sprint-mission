import * as notificationsRepository from '../repositories/notificationsRepository';
import { getIO } from '../lib/socket';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import { CreateNotificationData } from '../types/Notification';

/** 알림 생성 및 실시간 전송 */
export async function createAndSendNotification(data: CreateNotificationData) {
  // DB에 알림 저장
  const notification = await notificationsRepository.createNotification(data);

  // Socket.IO로 실시간 전송
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
    // Socket.IO 전송 실패해도 DB 저장은 유지
    console.error('Failed to send real-time notification:', error);
  }

  return notification;
}

/** 알림 목록 조회 */
export async function getNotifications(
  userId: number,
  limit: number = 20,
  offset: number = 0
) {
  return notificationsRepository.getNotificationsByUserId(userId, limit, offset);
}

/** 안 읽은 알림 개수 조회 */
export async function getUnreadCount(userId: number) {
  return notificationsRepository.countUnreadNotifications(userId);
}

/** 알림 읽음 처리 */
export async function markAsRead(notificationId: number, userId: number) {
  // 알림 존재 여부 및 권한 확인
  const notification = await notificationsRepository.getNotification(notificationId);

  if (!notification) {
    throw new NotFoundError('notification', notificationId);
  }

  if (notification.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the notification');
  }

  // 읽음 처리
  return notificationsRepository.markNotificationAsRead(notificationId);
}

/** 모든 알림 읽음 처리 */
export async function markAllAsRead(userId: number) {
  return notificationsRepository.markAllNotificationsAsRead(userId);
}
