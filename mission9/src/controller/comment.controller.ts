import { CommentService } from "../service/comment.service.js";
import type { Request, Response, NextFunction } from "express";
import type { CommentDTO, CommentPatchDTO } from "../dto/comment.dto.js";
import prisma from "../lib/prisma.js";
import { Server as HttpServer } from "http";
import { WebsocketService } from "../socket/socket.js";
import  { NotificationService } from "service/notification.service.js";
import type { PrismaClient } from "@prisma/client";

export class CommentController {
  private commentService: CommentService; // <- 초기화
  private notificationService:NotificationService;
  private wss: WebsocketService;
  private prisma :PrismaClient
  constructor(server: HttpServer) {
    this.wss = new WebsocketService(server);
    this.prisma = prisma
    this.notificationService = new NotificationService(this.prisma, this.wss)
    this.commentService = new CommentService(prisma, this.notificationService, this.wss,); // <- 공용 데이터
    //this.notificationService = new NotificationService(prisma)
  }

  async accessCommentList(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, take, type } = req.query;
      const commentId = req.query.id;
      let safeType: "MARKET" | "ARTICLE" | undefined = undefined;
      if (type === "MARKET" || type === "ARTICLE") safeType = type;
      const elements = {
        id: Number(commentId),
        page: Number(page ?? 1),
        take: Number(take ?? 10),
        type: safeType ?? "MARKET",
      };
      const result = await this.commentService.accessCommentList(elements);
      res.status(200).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async accessComment(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("accessComment 호출됨");
      const commentId = Number(req.params.id);
      const result = await this.commentService.accessComment(commentId);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new Error("unauthorized"); // 401

      const { content, title, type, productId, articleId, ownerId } = req.body;
      if (type === "MARKET" && !productId)
        throw new Error("MARKET 댓글은 productId가 필요합니다");
      if (type === "ARTICLE" && !articleId)
        throw new Error("ARTICLE 댓글은 articleId가 필요합니다");

      const elements: CommentDTO = {
        type: type === "MARKET" || type === "ARTICLE" ? type : undefined,
        content: String(content ?? ""),
        title: String(title ?? ""),
        ownerId: userId,
        productId,
        articleId,
      };
      const nickname = req.user?.nickname;
      if (!nickname) throw new Error("해당 닉네임 존재 하지 않습니다");
      console.log("nickname:", nickname)
      const comment = await this.commentService.createComment(
        userId,
        nickname,
        elements
      );

      res.status(201).json({
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async modifyComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("unauthorized"); // 401
      const commentId = Number(req.params.id);
      const { content, title } = req.body;
      const elements: CommentPatchDTO = {
        id: commentId,
        content: String(content ?? ""),
        title: String(title ?? ""),
        ownerId:userId
      };
      const result = await this.commentService.modifyComment(userId, elements);
      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new Error("unauthorized"); // 401
      const commentId = Number(req.params.id);
      const result = await this.commentService.deleteComment(commentId);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}
