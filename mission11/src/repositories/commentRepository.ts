import prisma from "../lib/prisma";

export class CommentRepository {
  async createProductComment(userId: number, productId: number, content: string) {
    return prisma.comment.create({
      data: { content, productId, articleId: null, userId },
    });
  }

  async createArticleComment(userId: number, articleId: number, content: string) {
    return prisma.comment.create({
      data: { content, productId: null, articleId, userId },
    });
  }

  async findById(commentId: number) {
    return prisma.comment.findUnique({ where: { id: commentId } });
  }

  async updateComment(commentId: number, content: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  async deleteComment(commentId: number) {
    return prisma.comment.delete({ where: { id: commentId } });
  }

  async findProductComments(productId: number, lastId?: number) {
    return prisma.comment.findMany({
      where: { articleId: null, productId },
      take: 5,
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }),
      select: { id: true, content: true, createdAt: true },
    });
  }

  async findArticleComments(articleId: number, lastId?: number) {
    return prisma.comment.findMany({
      where: { articleId, productId: null },
      take: 5,
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }),
      select: { id: true, content: true, createdAt: true },
    });
  }
}

export default new CommentRepository();