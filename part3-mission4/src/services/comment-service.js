import { parse } from 'dotenv';
import AppError from '../lib/appError.js';
import prisma from '../lib/prismaClient.js';

class CommentService {
  // 게시글 댓글 조회
  async getCommentsByArticleId(articleId, userId) {
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId), productId: null },
      include: {
        user: { select: { username: true } },
        likedBy: {
          where: { id: userId },
          select: { id: true, username: true },
        },
      },
    });

    if (!comments || comments.length === 0)
      throw new AppError('해당 게시글의 댓글을 찾을 수 없습니다.', 404);

    return comments.map((c) => ({
      ...c,
      isLiked: c.likedBy.length > 0,
      likeCount: c.likeCount,
    }));
  }

  // 상품 댓글 조회
  async getCommentsByProductId(productId, userId) {
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId), articleId: null },
      include: {
        user: { select: { username: true } },
        likedBy: {
          where: { id: userId },
          select: { id: true, username: true },
        },
      },
    });

    if (!comments || comments.length === 0)
      throw new AppError('해당 상품의 댓글을 찾을 수 없습니다.', 404);

    return comments.map((c) => ({
      ...c,
      isLiked: c.likedBy.length > 0,
      likeCount: c.likeCount,
    }));
  }

  // 게시글 단일 댓글 조회
  async getCommentByIdAndArticleId(articleId, commentId, userId) {
    const comment = await prisma.comment.findFirst({
      where: { id: parseInt(commentId), articleId: parseInt(articleId) },
      include: {
        user: { select: { username: true } },
        likedBy: {
          where: { id: userId },
          select: { id: true, username: true },
        },
      },
    });

    if (!comment) throw new AppError('해당 댓글을 찾을 수 없습니다.', 404);

    return {
      ...comment,
      isLiked: comment.likedBy.length > 0,
      likeCount: comment.likeCount,
    };
  }

  // 상품 단일 댓글 조회
  async getCommentByIdAndProductId(productId, commentId, userId) {
    console.log(
      'SERVICE - productId:',
      productId,
      'commentId:',
      commentId,
      'userId:',
      userId
    );
    const comment = await prisma.comment.findFirst({
      where: { id: parseInt(commentId), productId: parseInt(productId) },
      include: {
        user: { select: { username: true } },
        likedBy: {
          where: { id: userId },
          select: { id: true, username: true },
        },
      },
    });
    console.log('SERVICE - comment from DB:', comment);
    if (!comment) throw new AppError('해당 댓글을 찾을 수 없습니다.', 404);

    return {
      ...comment,
      isLiked: comment.likedBy.length > 0,
      likeCount: comment.likeCount,
    };
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
  async createProductComment(commentId, content, userId) {
    if (!commentId) throw new AppError('존재하지 않는 상품입니다', 404);
    const newComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        product: { connect: { id: parseInt(commentId) } },
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
        likeCount: true,
      },
    });
    return comments;
  }

  async getUserLikedComments(userId) {
    const likedComments = await prisma.comment.findMany({
      where: { likedBy: { some: { id: userId } } },
    });
    return likedComments;
  }

  async commentLike(userId, commentId) {
    const commentLiked = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: {
        likedBy: { connect: { id: userId } },
        likeCount: { increment: 1 },
      },
    });
    return commentLiked;
  }

  async commentUnlike(userId, commentId) {
    const commentUnliked = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: {
        likedBy: { disconnect: { id: userId } },
        likeCount: { decrement: 1 },
      },
    });
    return commentUnliked;
  }
}

export const commentService = new CommentService();
