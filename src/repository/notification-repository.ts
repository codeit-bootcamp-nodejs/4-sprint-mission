import { Prisma, PrismaClient, Notification } from "@prisma/client";

export class NotificationRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * 알림 생성 (단일)
   */
  createNotification = async (
    userId: number,
    message: string,
    type: string,
    link: string
  ): Promise<Notification> => {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
        type,
        link,
      },
    });
  };

  /**
   * 알림 생성 (다수)
   * 가격 변동 시 여러 사용자에게 한 번에 알림을 보낼 때 사용
   */
  createManyNotifications = async (
    notifications: Prisma.NotificationCreateManyInput[]
  ) => {
    return this.prisma.notification.createMany({
      data: notifications,
    });
  };

  /**
   * 특정 사용자의 알림 목록 조회 (최신순)
   */
  findNotificationsByUserId = async (
    userId: number
  ): Promise<Notification[]> => {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  };

  /**
   * 특정 사용자의 안 읽은 알림 개수 조회
   */
  countUnreadNotifications = async (userId: number): Promise<number> => {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  };

  /**
   * 특정 알림을 읽음 처리
   */
  markAsRead = async (notificationId: number): Promise<Notification> => {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  };

  /**
   * ID로 알림 단일 조회 (권한 확인용)
   */
  findNotificationById = async (
    notificationId: number
  ): Promise<Notification | null> => {
    return this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
  };
}
