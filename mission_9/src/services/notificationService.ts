import notificationRepository from '../repository/notificationRepository.js';
import { getIO } from '../lib/socket.js';

async function createNotification(
  userId: number,
  message: string,
  articleId?: number,
  productId?: number
) {
  const newNotification = await notificationRepository.create(
    userId,
    message,
    articleId,
    productId
  );

  // 특정 유저ID에게 실시간 알림 전송
  const io = getIO();
  io.to(String(userId)).emit('new_notification', newNotification);

  // Also emit an unread count update
  const unreadCount = await notificationRepository.getUnreadCount(userId);
  io.to(String(userId)).emit('unread_count', unreadCount);

  return newNotification;
}

async function getUserNotifications(userId: number) {
  return notificationRepository.findManyByUserId(userId);
}

async function getUnreadNotificationCount(userId: number) {
  return notificationRepository.getUnreadCount(userId);
}

async function markNotificationAsRead(notificationId: number, userId: number) {
  const updatedNotification = await notificationRepository.markAsRead(
    notificationId,
    userId
  );

  // Emit an unread count update
  const io = getIO();
  const unreadCount = await notificationRepository.getUnreadCount(userId);
  io.to(String(userId)).emit('unread_count', unreadCount);

  return updatedNotification;
}

async function markAllNotificationsAsRead(userId: number) {
  const result = await notificationRepository.markAllAsRead(userId);

  // Emit an unread count update
  const io = getIO();
  io.to(String(userId)).emit('unread_count', 0);

  return result;
}

export default {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
