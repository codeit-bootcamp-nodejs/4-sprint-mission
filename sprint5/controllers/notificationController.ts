import type { Request, Response, NextFunction } from "express";
import { notificationService } from "../services/notificationService";

export const notificationController = {
  getNotificationsByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = Number(req.user?.id);

      if (!userId) {
        const error: HttpError = new Error("접근 권한이 없습니다.");
        error.status = 403;
        throw error;
      }

      const notifications = await notificationService.getNotificationsByUser(
        userId
      );

      res.status(200).json(notifications);
    } catch (err) {
      throw err;
    }
  },

  getUnreadCount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);

      if (!userId) {
        const error: HttpError = new Error("접근 권한이 없습니다.");
        error.status = 403;
        throw error;
      }

      const notificationsCount = await notificationService.getUnreadCount(
        userId
      );

      res.status(200).json(notificationsCount);
    } catch (err) {
      throw err;
    }
  },

  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      const notificationId = Number(req.params.id);

      if (!userId) {
        const error: HttpError = new Error("접근 권한이 없습니다.");
        error.status = 403;
        throw error;
      }

      await notificationService.markAsRead(userId, notificationId);

      res.status(200).json({ message: "알림이 읽음 처리되었습니다." });
    } catch (err) {
      throw err;
    }
  },
};
