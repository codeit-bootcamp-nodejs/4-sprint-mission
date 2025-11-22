import type { Request, Response, NextFunction} from "express";
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import { getNotificationByUser, getUnreadCount, markAllAsRead, markAsRead } from "../services/notification.service.js";

// 내 알림 목록 조회
export async function notificationList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);

    const userId = Number(userIdStr);
    const list = await getNotificationByUser(userId);

    res.status(200).json({
      message: "알림 목록 조회 성공",
      data: list,
    })
  } catch (err) {
    next (err);
  }
}

// 안 읽은 알림 개수 조회
export async function  unreadNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);

    const userId = Number(userIdStr);
    const count = await getUnreadCount(userId);

    res.status(200).json({
      message: "안 읽은 알림 개수 조회 성공",
      data: { count },
    });
  } catch (err) {
    next(err);
  }
}

// 단일 알림 읽음 처리
export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);

    const userId = Number(userIdStr);
    const notificationId = Number(req.params.id);
    if (isNaN(notificationId)) throw new HttpError("잘못된 알림 ID입니다.", 400);

    const updated = await markAsRead(notificationId, userId);

    res.status(200).json({
      message: "알림 읽음 처리 성공",
      data: updated,
    });
  } catch (err){
    next(err);
  }
}

// 전체 알림 읽음 처리
export async function markAllNotificationAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);

    const userId = Number(userIdStr);
    await markAllAsRead(userId);
    
    res.status(200).json({
      message: "모든 알림을 읽음 처리했습니다.",
    });
  } catch (err) {
    next(err);
  }
}