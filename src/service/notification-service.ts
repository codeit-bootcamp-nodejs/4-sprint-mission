import { Notification } from "@prisma/client";
import { Server } from "socket.io";
import { NotificationRepository } from "../repository/notification-repository";
import { NotificationResponseDto } from "../types/dto";

export class NotificationService {
  private io: Server;

  constructor(
    private notificationRepository: NotificationRepository,
    io: Server
  ) {
    this.io = io;
  }

  /**
   * 알림을 생성하고 실시간으로 전송합니다.
   * @param userId 알림을 받을 사용자 ID
   * @param message 알림 메시지
   * @param type 알림 타입 (예: "NEW_COMMENT")
   * @param link 클릭 시 이동할 링크
   */
  createAndSendNotification = async (
    userId: number,
    message: string,
    type: string,
    link: string
  ): Promise<void> => {
    // 1. DB에 알림 저장
    const newNotification =
      await this.notificationRepository.createNotification(
        userId,
        message,
        type,
        link
      );

    // 2. 해당 사용자에게 실시간 알림 전송
    // 'user_room_{userId}' 방에 있는 클라이언트에게 'new_notification' 이벤트 발송
    this.io.to(`user_room_${userId}`).emit("new_notification", newNotification);

    // 3. (추가) 안 읽은 알림 개수도 전송
    await this.sendUnreadCount(userId);
  };

  /**
   * 특정 사용자의 알림 목록을 조회합니다.
   */
  getNotifications = async (
    userId: number
  ): Promise<NotificationResponseDto[]> => {
    const notifications =
      await this.notificationRepository.findNotificationsByUserId(userId);
    return notifications.map(this.mapToResponseDto);
  };

  /**
   * 특정 사용자의 안 읽은 알림 개수를 조회합니다.
   */
  getUnreadCount = async (userId: number): Promise<{ count: number }> => {
    const count =
      await this.notificationRepository.countUnreadNotifications(userId);
    return { count };
  };

  /**
   * 특정 알림을 읽음 처리합니다.
   */
  readNotification = async (
    userId: number,
    notificationId: number
  ): Promise<NotificationResponseDto> => {
    const notification =
      await this.notificationRepository.findNotificationById(notificationId);

    if (!notification) {
      throw new Error("알림을 찾을 수 없습니다.");
    }
    if (notification.userId !== userId) {
      throw new Error("알림을 읽을 권한이 없습니다.");
    }

    const updatedNotification =
      await this.notificationRepository.markAsRead(notificationId);

    // 읽음 처리 후, 변경된 안 읽은 개수를 다시 전송
    await this.sendUnreadCount(userId);

    return this.mapToResponseDto(updatedNotification);
  };

  /**
   * 사용자에게 안 읽은 알림 개수를 실시간으로 전송합니다.
   */
  sendUnreadCount = async (userId: number): Promise<void> => {
    const count =
      await this.notificationRepository.countUnreadNotifications(userId);
    this.io.to(`user_room_${userId}`).emit("unread_count", { count });
  };

  /**
   * Prisma Notification 모델을 클라이언트 DTO로 변환합니다.
   */
  private mapToResponseDto = (
    notification: Notification
  ): NotificationResponseDto => {
    return {
      id: notification.id,
      message: notification.message,
      link: notification.link,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  };
}
