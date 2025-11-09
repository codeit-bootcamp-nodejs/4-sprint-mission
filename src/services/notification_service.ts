import * as notificationRepo from "../repository/notification_repository";
import { sendNotification } from "../app";

// 알림 생성
export async function createNotificationService(
  userId: number,
  message: string
) {
  const notification = await notificationRepo.createNotification(
    userId,
    message
  );
  sendNotification(userId, message);
  return notification;
}

// 알림 + 안 읽음 개수 조회
export async function getNotificationsService(userId: number) {
  const notifications = await notificationRepo.getNotifications(userId);
  const unreadNotifications = await notificationRepo.getNotreadNotifications(
    userId
  );
  return { notifications, unreadNotifications };
}

// 알림 읽음
export async function readNotificationService(notificationId: number) {
  const notification = await notificationRepo.readNotification(notificationId);
  return notification;
}
