import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma.js";
import type {
  CommentQueryDTO,
  CommentDTO,
  CommentPatchDTO,
} from "../dto/comment.dto.js";
import { Helper } from "../helper/helper.js";
import { NotificationService } from "./notification.service.js"


const helper = new Helper();
export class CommentService {
  private prisma: PrismaClient; // ← 필드 선언
  private notificationService :  NotificationService
  constructor(prisma: PrismaClient) {
    this.prisma = prisma; // <-  생성자에서 필드 초기화
    this.notificationService =  new NotificationService(prisma)
  }

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

  async createComment(elements: CommentDTO) {
    const { content, title, name, type, productId, articleId } = elements;
    const connectData =
      type === "MARKET"
        ? { connect: { id: productId } }
        : { connect: { id: articleId } };
    const result = await this.prisma.comment.create({
      data: {
        content,
        title,
        name,
        ...connectData,
      },
    });
    return result;
  }

  async modifyComment(userId: Number, elements: CommentPatchDTO) {
    const { id, content, title} = elements;
    const commentId = id;
    
    const comment = await helper.findCommentById(commentId);
    if (!comment) throw new Error("해당 댓글이 없습니다"); //404

    const element = {
      content: elements.content ?? "",
      title: elements.title ??  "",
    };
    const result = await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        ...element,
      },
    });
    return result;
  }

  async deleteComment(commentId:number) {
    const comment = await helper.findCommentById(commentId)
    if (!comment) throw new Error ("해당 댓글이 없습니다") // 404

    const result = await this.prisma.comment.delete({
        where:{id: commentId}
    })
    return result
  }
}
 