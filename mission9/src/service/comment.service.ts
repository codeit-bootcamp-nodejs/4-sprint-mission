import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma.js";
import type {
  CommentQueryDTO,
  CommentDTO,
  CommentPatchDTO,
} from "../dto/comment.dto.js";
import { Helper } from "../helper/helper.js";
import { NotificationService } from "./notification.service.js";
import { emitToUser } from "../server.js";
import { WebsocketService } from "../socket/socket.js";

const helper = new Helper();
export class CommentService {
  constructor(
    private prisma: PrismaClient, // ← 필드 선언
    private notificationService: NotificationService,
    private wss: WebsocketService
  ) {}

  async accessCommentList(elements: CommentQueryDTO) {
    const { id, page, take, type } = elements;
    const skip = (page - 1) * take;
    const commentId = Number(id);
    const whereCondition = // 검색 조건
      type === "MARKET" ? { productId: commentId } : { articleId: commentId };

    const result = await this.prisma.comment.findMany({
      where: whereCondition,
      skip,
      take,
    });
    return result;
  }

  async accessComment(commentId: number) {
    const comment = await helper.findCommentById(commentId);
    if (!comment) throw new Error("해당 댓글이 존재 하지 않습니다"); // 404

    return comment;
  }

  async createComment(userId: number, nickname: string, elements: CommentDTO) {
    const { content, title, type, productId, articleId } = elements;

    const connectData =
      type === "MARKET"
        ? { product: { connect: { id: productId } } }
        : { article: { connect: { id: articleId } } };
    console.log(nickname);
    const result = await this.prisma.comment.create({
      data: {
        content,
        title,
        type,
        ...connectData,
      },
    });
    let articleIdParam: number | undefined;
    let productIdParam: number | undefined;
    let targetId: number | undefined;
    if (type === "MARKET") {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { ownerId: true },
      });
      console.log(type, productId, articleId);
      if (!product) throw new Error("해당 제품이 존재 하지 않습니다");
      targetId = product.ownerId;
    } else if (type === "ARTICLE") {
      const article = await this.prisma.article.findUnique({
        where: {
          id: articleId,
        },
        select: { ownerId: true },
      });
      if (!article) throw new Error("해당 게시글이 존재 하지 않습니다");
      targetId = article.ownerId;
    }
    console.log("targetId:", targetId);
    if (targetId === undefined) {
      throw new Error("댓글 대상이 존재하지 않습니다");
    }
    const targetEntityId = type === "MARKET" ? productId : articleId;
    if (targetId !== userId) {
      const { notification, payload } =
        await this.notificationService.createAndGenerate(
          userId,
          targetId,
          `${nickname}님이 댓글을 남겼습니다.`,
          "UNREAD",
          "NEW_COMMENT",
          type === "ARTICLE" ? articleId : undefined, // articleId
          type === "MARKET" ? productId : undefined, // productId
          nickname
        );
        console.log( notification, payload )
      this.wss.emitToUser(targetId, "NEW_COMMENT", {
        type: "NEW_COMMENT",
        payload,
      });
    }
    return result;
  }
  async modifyComment(userId: Number, elements: CommentPatchDTO) {
    const { id, content, title } = elements;
    const commentId = id;

    const comment = await helper.findCommentById(commentId);
    if (!comment) throw new Error("해당 댓글이 없습니다"); //404

    const element = {
      content: elements.content ?? "",
      title: elements.title ?? "",
    };
    const result = await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        ...element,
      },
    });
    return result;
  }

  async deleteComment(commentId: number) {
    const comment = await helper.findCommentById(commentId);
    if (!comment) throw new Error("해당 댓글이 없습니다"); // 404

    const result = await this.prisma.comment.delete({
      where: { id: commentId },
    });
    return result;
  }
}
