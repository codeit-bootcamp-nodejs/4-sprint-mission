import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from '../services/notifications.service.js';

export class NotificationsController {
  notificationsService = NotificationsService.getInstance();

  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const notifications = await this.notificationsService.getNotifications(user.id);
      return res.status(200).json({ data: notifications });
    } catch (err) {
      next(err);
    }
  };

  getUnreadNotificationCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const count = await this.notificationsService.getUnreadNotificationCount(user.id);
      return res.status(200).json({ count });
    } catch (err) {
      next(err);
    }
  };

  markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      await this.notificationsService.markNotificationAsRead(+notificationId, user.id);
      return res.status(200).json({ message: '알림을 읽음 처리했습니다.' });
    } catch (err) {
      next(err);
    }
  };

  markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      await this.notificationsService.markAllNotificationsAsRead(user.id);
      return res.status(200).json({ message: '모든 알림을 읽음 처리했습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
