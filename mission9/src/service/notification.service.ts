import type {
  PrismaClient,
  Notification,
  NotificationTypes,
  NotificationCategory,
} from "@prisma/client";
import prisma from "../lib/prisma.js";
import type {
  NotificationQuery,
} from "../dto/notification.dto.js";
import type { NotificationPayload } from "../socket/socket.js"; // WebSocketMessage 타입 포함
import WebSocket, { WebSocketServer } from "ws";

import type { WebsocketService } from "../socket/socket.js";
export class NotificationService {
  
  private prisma: PrismaClient;
  private wss: WebsocketService
  constructor(prisma: PrismaClient, wss : WebsocketService) {
    this.prisma = prisma;
    this.wss  = wss
  }


  async accessAlerts(query: NotificationQuery) {
    const { page, take, category, type } = query;
    const skip = (page - 1) * take;

    const result = await this.prisma.notification.findMany({
      where: {
        type,
        category,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  }

  async createNotification(
    senderId: number,
    receiverId: number,
    content: string,
    type: NotificationTypes,
    category: NotificationCategory,
    nickname:string,
  ): Promise<Notification> {
    const data = {
      senderId,
      receiverId,
      content,
      type,
      category,
      nickname
    }
    console.log("nickname:", nickname)
    return this.prisma.notification.create({ data });
  }
  async createAndGenerate(
    senderId: number,
    receiverId: number,
    content: string,
    type: NotificationTypes,
    category: NotificationCategory,
    articleId?: number,
    productId?: number,
    nickname?: string,
    oldPrice?: number,
    newPrice?: number
    
  ): Promise<{ notification: Notification; payload: NotificationPayload }> {
      
    console.log("senderId:",senderId)
     const commenter = await this.prisma.user.findUnique({
        where: { id: senderId }
      });
    if (!commenter) throw new Error("Commenter not found");
    
    console.log("receiverId", receiverId)
  const finalNickname = nickname ?? commenter.nickname ?? ""
    const notification = await this.createNotification(
      senderId,
      receiverId,
      content,
      type,
      category,
      finalNickname
    );
    console.log(finalNickname)
    let payload: NotificationPayload;
    if (category === "CHANGED_PRICE") {
      payload = {
        type: "CHANGED_PRICE",
        productId: productId!,
        userId: senderId,
        message: `상품 가격이 ${oldPrice} → ${newPrice}로 변경되었습니다.`,
      };
    } else {
      payload = await this.generatePayload(
        category,
        senderId,
        content,
        articleId,
        productId,
        nickname
      );
    }
    console.log(notification)
    console.log(notification, payload)
    return { notification, payload };
  }

 async generatePayload(
    category: "NEW_COMMENT" | "NEW_LIKE" | "CHANGED_PRICE",
    userId: number,
    content: string,
    articleId?: number,
    productId?: number,
    nickname?: string
  ): Promise<NotificationPayload>{
      const user = !nickname ? await this.prisma.user.findUnique({ where: { id: userId } }) : null;
  const finalNickname = nickname ?? user?.nickname ?? "unknown";


    switch (category) {
      case "NEW_COMMENT":
        return {
          type: "NEW_COMMENT",
          articleId: articleId ?? 0,
          productId: productId ?? 0,
          nickname: finalNickname,
          userId,
          message: content,
        };
      case "NEW_LIKE":
        return {
          type: "NEW_LIKE",
          articleId: articleId ?? 0,
          productId: productId ?? 0,
          likerName: nickname ?? "unknown",
          userId,
          message: content,
        };
      case "CHANGED_PRICE":
        return {
          type: "CHANGED_PRICE",
          productId: productId ?? 0,
          userId,
          message: content,
        };
    }
  }
  emitToUser(userId: number, message: NotificationPayload) {
    this.wss.clients.forEach((client: any) => {
      if (client.readyState === WebSocket.OPEN && client.userId === userId) {
        client.send(JSON.stringify({ type: "notification", payload: message }));
      }
    });
  }
}
