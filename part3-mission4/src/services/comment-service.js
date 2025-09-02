import prisma from '../prismaClient.js';

class CommentService {
  async getCommentsByArticleId(id) {
    return prisma.comment.findMany({
      where: {
        articleId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getCommentsByProductId(id) {
    return prisma.comment.findMany({
      where: {
        productId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getCommentByIdAndArticleId(id, commentId) {
    return prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
        articleId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getCommentByIdProductId(id, commentId) {
    return prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
        productId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createArticleComment(id, content) {
    return prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: parseInt(id) },
        },
      },
    });
  }

  async createProductComment(id, content) {
    return prisma.comment.create({
      data: {
        content,
        product: {
          connect: { id: parseInt(id) },
        },
      },
    });
  }

  async updateComment(commentId, content) {
    return prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
  }

  async deleteComment(commentId) {
    return prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
  }
}

export const commentService = new CommentService();
