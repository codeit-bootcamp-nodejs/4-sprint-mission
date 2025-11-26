import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../service/notification-service.js";

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  /**
   * 내 알림 목록 조회
   */
  getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const notifications =
        await this.notificationService.getNotifications(userId);
      res.status(200).json({ data: notifications });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 안 읽은 알림 개수 조회
   */
  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const count = await this.notificationService.getUnreadCount(userId);
      res.status(200).json(count); // { count: 5 }
    } catch (error) {
      next(error);
    }
  };

  /**
   * 알림 읽음 처리
   */
  readNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;
      const idAsNumber = parseInt(notificationId, 10);

      if (isNaN(idAsNumber)) {
        return res.status(400).json({ error: "유효하지 않은 알림 ID입니다." });
      }

      const notification = await this.notificationService.readNotification(
        userId,
        idAsNumber
      );
      res.status(200).json({ data: notification });
    } catch (error) {
      next(error);
    }
  };
}
