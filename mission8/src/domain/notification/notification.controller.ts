import type { NextFunction, Request, Response } from 'express';

import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/exception.js';
import { notificationService } from './notification.service.js';

class NotificationController {
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }
      const userId = Number(req.user.id);
      const notifications = await notificationService.list(userId);
      res.status(STATUS_CODE.SUCCESS).json(notifications);
    } catch (err) {
      next(err);
    }
  };

  unreadCount = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await notificationService.unreadCount();
      res.status(STATUS_CODE.SUCCESS).json(count);
    } catch (err) {
      next(err);
    }
  };

  read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationIds } = req.body;
      const result = await notificationService.read(notificationIds);
      res.status(STATUS_CODE.SUCCESS).json(result);
    } catch (err) {
      next(err);
    }
  };
}

export const notificationController = new NotificationController();
