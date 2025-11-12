import prisma from "./prisma";

// 알림 생성
export async function createNotification(userId: number, message: string) {
  await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
}

// 알림 조회
export async function getNotifications(userId: number) {
  return await prisma.notification.findMany({
    where: { userId },
  });
}

// 알림 읽음
export async function readNotification(notificationId: number) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

// 안 읽음 개수 조회
export async function getNotreadNotifications(userId: number) {
  return await prisma.notification.count({
    where: { userId, isRead: false },
  });
}
