import type { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notificationService.js';
import { sendResponse } from '../utils/response.js';
import { CustomError } from '../middlewares/errorHandler.js';

/** 알림 목록 조회 */
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }

        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

        // limit, offset 유효성 검증
        if (isNaN(limit) || limit < 1 || limit > 100) {
            throw new CustomError('limit은 1에서 100 사이의 숫자여야 합니다.', 400);
        }
        if (isNaN(offset) || offset < 0) {
            throw new CustomError('offset은 0 이상의 숫자여야 합니다.', 400);
        }

        const notifications = await notificationService.getNotifications(req.user.id, limit, offset);

        sendResponse(res, 200, '알림 목록 조회 성공', { notifications });
    } catch (error) {
        next(error);
    }
};

/** 안 읽은 알림 개수 조회 */
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }

        const unreadCount = await notificationService.getUnreadCount(req.user.id);

        sendResponse(res, 200, '안 읽은 알림 개수 조회 성공', { unreadCount });
    } catch (error) {
        next(error);
    }
};

/** 알림 읽음 처리 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }

        const notificationId = parseInt(req.params.id);

        if (isNaN(notificationId)) {
            throw new CustomError('유효하지 않은 알림 ID입니다.', 400);
        }

        const notification = await notificationService.markAsRead(notificationId, req.user.id);

        sendResponse(res, 200, '알림을 읽음 처리했습니다.', { notification });
    } catch (error) {
        next(error);
    }
};

/** 모든 알림 읽음 처리 */
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }

        await notificationService.markAllAsRead(req.user.id);

        sendResponse(res, 200, '모든 알림을 읽음 처리했습니다.');
    } catch (error) {
        next(error);
    }
};
