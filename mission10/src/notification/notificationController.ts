import { Request, Response } from "express";
import { notificationService } from "./notificationService"; 
import { io } from "../socket/socket";

//알림 목록 조회 GET - 사용자는 자신의 알림 목록을 조회할 수 있습니다.
export async function getNotifications(req: Request, res: Response) {
    try {
        const userId = req.user.id;//로그인한 유저
        const notifications = await notificationService.getNotifications(userId);
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "알림목록 조회 실패" });
    }
}



//안앍은 알림개수 조회 GET(- 사용자는 자신의 안 읽은 알림의 개수를 조회할 수 있습니다.)
export async function getUnreadCount(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const count = await notificationService.getUnreadCount(userId);
        res.status(200).json({ unreadCount: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "안읽은 알림개수 조회 실패" });
    }
}



//알림 읽음 처리(patch) (사용자는 자신의 알림을 읽음 처리 할 수 있습니다.)
export async function markAsRead(req: Request, res: Response) {
    try {
        const notificationId = Number(req.params.id);
        const userId = req.user.id;
        const updated = await notificationService.markAsRead(notificationId, userId);
        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "알림 읽음 처리 실패" });
    }
}



// //클라이언트에서는 실시간으로 알림을 받을 수 있습니다.
//미션 목표는 “실시간 알림 기능”을 구현하는 핵심 부분, Socket.IO(WebSocket 기반) 을 통해 클라이언트(브라우저)로 바로 전달,새로고침을 안 해도 알림이 바로 뜨는 시스템
export async function sendNotification(req: Request, res: Response) {
  try {
    const { userId, message } = req.body;
    const notification = await notificationService.createNotification(userId, message);

    io.to(`user-${userId}`).emit("new-notification", notification);
    res.status(201).json(notification);
  } catch (error) {
    console.error("❌ sendNotification Error:", error);
    res.status(500).json({ message: "알림 전송 실패" });
  }
}