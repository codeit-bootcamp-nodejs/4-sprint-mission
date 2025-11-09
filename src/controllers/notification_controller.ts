import { Request, Response } from "express";
import * as NotificationService from "../services/notification_service";

// 알림 조회
export async function getNotificationsController(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  const notifications = await NotificationService.getNotificationsService(
    user.id
  );
  res.status(200).json({ notifications });
}

// 알림 읽음
export async function readNotificationController(req: Request, res: Response) {
  const notificationId = Number(req.params.notificationId);
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  const notification = await NotificationService.readNotificationService(
    notificationId
  );
  res.status(200).json({ notification });
}
