import AppError from '../lib/appError.js';
import prisma from '../lib/prismaClient.js';

class CommentService {
  // 게시글 댓글 조회
  async getCommentsByArticleId(articleId) {
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!comments || comments.length === 0) {
      throw new AppError('해당 게시글의 댓글을 찾을 수 없습니다.', 404);
    }
    return comments;
  }

  // 상품 댓글 조회
  async getCommentsByProductId(productId) {
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!comments || comments.length === 0) {
      throw new AppError('해당 상품의 댓글을 찾을 수 없습니다.', 404);
    }
    return comments;
  }

  // 게시글 단일 댓글 조회
  async getCommentByIdAndArticleId(articleId, commentId) {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!comment) {
      throw new AppError('해당 댓글을 찾을 수 없습니다.', 404);
    }
    return comment;
  }

  // 상품 단일 댓글 조회
  async getCommentByIdAndProductId(productId, commentId) {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!comment) {
      throw new AppError('해당 댓글을 찾을 수 없습니다.', 404);
    }
    return comment;
  }

  // 게시글 댓글 생성
  async createArticleComment(articleId, content, userId) {
    if (!articleId) throw new AppError('존재하지 않는 게시글입니다', 404);
    const newComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        article: { connect: { id: parseInt(articleId) } },
      },
    });
    return newComment;
  }

  // 상품 댓글 생성
  async createProductComment(productId, content, userId) {
    if (!productId) throw new AppError('존재하지 않는 상품입니다', 404);
    const newComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        product: { connect: { id: parseInt(productId) } },
      },
    });

    return newComment;
  }

  // 댓글 수정 (본인 소유만)
  async updateComment(commentId, userId, content) {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment) throw new AppError('댓글을 찾을 수 없습니다.', 404);
    if (comment.userId !== userId) throw new AppError('권한이 없습니다.', 403);

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
    return updatedComment;
  }

  // 댓글 삭제 (본인 소유만)
  async deleteComment(commentId, userId) {
    const deleted = await prisma.comment.deleteMany({
      where: { id: parseInt(commentId), userId },
    });

    if (deleted.count === 0) {
      throw new AppError('권한이 없거나 댓글이 존재하지 않습니다.', 403);
    }

    return { message: '댓글이 삭제되었습니다.' };
  }

  async getUserComments(userId) {
    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        content: true,
        article: {
          select: {
            id: true,
            title: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return comments;
  }
}

export const commentService = new CommentService();
