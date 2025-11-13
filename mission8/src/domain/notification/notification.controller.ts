import type { NextFunction, Request, Response } from 'express';

import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import logger from '../../utils/logger.js';
import { notificationService } from './notification.service.js';

class NotificationController {
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }

      logger.debug({ message: `알림 컨트롤러 req.params: ${JSON.stringify(req.params, null, 2)}` });
      const getListInput = {
        userId: req.user.id,
        page: Number(req.params['page']),
        limit: Number(req.params['limit']),
      };

      const { notifications, total } = await notificationService.list(getListInput);
      res.status(STATUS_CODE.OK).json({
        page: getListInput.page,
        limit: getListInput.limit,
        total,
        notifications,
      });
    } catch (err) {
      next(err);
    }
  };

  unreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }
      const userId = req.user.id;
      const count = await notificationService.unreadCount(userId);
      res.status(STATUS_CODE.OK).json(count);
    } catch (err) {
      next(err);
    }
  };

  read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }
      const userId = req.user.id;
      const { notificationIds } = req.body;
      const result = await notificationService.read(notificationIds, userId);
      res.status(STATUS_CODE.OK).json(result);
    } catch (err) {
      next(err);
    }
  };
}

export const notificationController = new NotificationController();
