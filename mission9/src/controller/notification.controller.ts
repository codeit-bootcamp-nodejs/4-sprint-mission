import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import { NotificationService } from "../service/notification.service.js";
import type { WebsocketService } from "../socket/socket.js";
import type { PrismaClient } from "@prisma/client";

export class NotificationController {
  private wss: WebsocketService;
  private notificationService: NotificationService;
  constructor(prisma: PrismaClient ,wss: WebsocketService) {
    this.wss = wss;
    this.notificationService = new NotificationService(prisma, wss);
    
  }
  async accessAlerts(req: Request, res: Response, next: NextFunction) {
    const { page, type, take, category } = req.query;
    let safeType: "UNREAD" | "IS_READ" | undefined = undefined;
    if (type === "UNREAD" || type === "IS_READ") {
      safeType = type;
    }
    let safeCategory: "NEW_COMMENT" | "NEW_LIKE" | "CHANGED_PRICE" | undefined =
      undefined;

    if (
      category === "NEW_COMMENT" ||
      category === "NEW_LIKE" ||
      category === "CHANGED_PRICE"
    ) {
      safeCategory = category;
    }
    const query = {
      page: Number(page ?? 1),
      take: Number(take ?? 10),
      type: safeType ?? "UNREAD",
      category: safeCategory ?? "NEW_COMMENT",
    };
    const user = Number(req.user?.id);
    if (!user) throw new Error("Unathorized"); // 401
    try {
      const result = await this.notificationService.accessAlerts(query);
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async accessAlertsCnt(req: Request, res: Response, next: NextFunction) {}

  async alertSend(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("unathorized");

      const {
        senderId,
        receiverId,
        category,
        type,
        content,
        id,
        createdAt,
        articleId,
        productId,
      } = req.body;
      let safeType: "UNREAD" | "IS_READ" | undefined = undefined;
      if (type === "UNREAD" || type === "IS_READ") {
        safeType = type;
      }
      let safeCategory:
        | "NEW_COMMENT"
        | "NEW_LIKE"
        | "CHANGED_PRICE"
        | undefined = undefined;

      if (
        category === "NEW_COMMENT" ||
        category === "NEW_LIKE" ||
        category === "CHANGED_PRICE"
      ) {
        safeCategory = category;
      }
      if (senderId === receiverId) throw new Error("알림 에러");

      const elements = {
        id,
        content: content ?? "",
        senderId: userId,
        receiverId,
        category: safeCategory ?? "NEW_COMMENT",
        type: safeType ?? "UNREAD",
        createdAt,
      };
      if (!req.user?.nickname) throw new Error("해당 유저 존재하지않습니다");
      const notification = await this.notificationService.createNotification(
        elements.senderId,
        elements.receiverId,
        elements.content,
        elements.type,
        elements.category,
        req.user.nickname
      );
      const payload = await this.notificationService.generatePayload(
        safeCategory ?? "NEW_COMMENT",
        userId,
        content,
        articleId,
        productId,
        req.user.nickname
      );
      this.wss.broadcast({
        type: "notification",
        payload,
      });
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  }

  async modifyStatus(req: Request, res: Response, next: NextFunction) {}
}
