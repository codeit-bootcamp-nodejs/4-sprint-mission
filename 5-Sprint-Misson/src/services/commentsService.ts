import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CommentsService {
  async createForProduct(userId: number, productId: number, content: string) {
    return prisma.comment.create({
      data: { content, productId, userId },
    });
  }

  async createForArticle(userId: number, articleId: number, content: string) {
    return prisma.comment.create({
      data: { content, articleId, userId },
    });
  }

  async updateComment(commentId: number, userId: number, content: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("댓글 없음");
    if (comment.userId !== userId) throw new Error("권한 없음");

    return prisma.comment.update({ where: { id: commentId }, data: { content } });
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("댓글 없음");
    if (comment.userId !== userId) throw new Error("권한 없음");

    await prisma.comment.delete({ where: { id: commentId } });
  }

  async listForProduct(productId: number, cursor?: number, take = 10) {
    return prisma.comment.findMany({
      where: { productId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: "asc" },
      select: { id: true, content: true, createdAt: true, user: { select: { id: true, nickname: true } } },
    });
  }

  async listForArticle(articleId: number, cursor?: number, take = 10) {
    return prisma.comment.findMany({
      where: { articleId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: "asc" },
      select: { id: true, content: true, createdAt: true, user: { select: { id: true, nickname: true } } },
    });
  }
}
