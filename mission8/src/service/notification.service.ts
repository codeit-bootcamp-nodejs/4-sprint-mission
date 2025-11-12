import type { PrismaClient, Notification, NotificationTypes, NotificationCategory} from "@prisma/client";
import  prisma  from "../lib/prisma.js"
import type{NotificationDTO, NotificationQuery} from "../dto/notification.dto.js"
import type { NotificationPayload } from "../socket/socket.js"; // WebSocketMessage 타입 포함



export class NotificationService{
    private prisma : PrismaClient;
    constructor(prisma:PrismaClient){
        this.prisma = prisma
    }

    async accessAlerts(
        query:NotificationQuery
    ){
        const {page, take, category, type} = query;
        const skip = (page - 1) * take
        
        const result = await this.prisma.notification.findMany({
            where:{
                type,
                category
            },
            skip,
            take,
            orderBy:{
                createdAt:"desc"
            }
        })
        return result;
    }


    async createNotification(
    senderId: number,
    receiverId: number,
    content: string,
    type: NotificationTypes,
    category: NotificationCategory):Promise<Notification>{
        const data = {
                senderId,
                receiverId,
                content,
                type,
                category
            }
        return this.prisma.notification.create({ data });
    }
    async createAndGenerate (
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
): Promise<{ notification: Notification; payload: NotificationPayload }>{
    const notification = await this.createNotification(
        senderId,
        receiverId,
        content,
        type,
        category
    )
    let payload: NotificationPayload;
    if (category === "CHANGED_PRICE"){
        payload = {
            type: "CHANGED_PRICE",
            productId: productId!,
            userId: senderId,
            
            message: `상품 가격이 ${oldPrice} → ${newPrice}로 변경되었습니다.`,
        };
    }else {
        payload = this.generatePayload(category, senderId, content, articleId, productId, nickname);
        }
    return { notification, payload };
    }

    
  generatePayload(
    category: "NEW_COMMENT" | "NEW_LIKE" | "CHANGED_PRICE",
    userId: number,
    content: string,
    articleId?: number,
    productId?: number,
    nickname?: string,
  ): NotificationPayload {
    switch (category) {
      case "NEW_COMMENT":
        return {
          type: "NEW_COMMENT",
          articleId: articleId!,
          productId: productId!,
          commenter: nickname ?? "unknown",
          userId,
          message: content,
        };
      case "NEW_LIKE":
        return {
          type: "NEW_LIKE",
          articleId :articleId ?? 0,
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
}