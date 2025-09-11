import prisma from "../libs/prismaClient.js";
import type { CustomError } from "../types/error.js";
import type { CreateCommentData, UpdateCommentData, FindManyCommentParams } from "../types/comment.js";
import { Prisma } from "@prisma/client";

const CommentService = {
  async createComment({ content, productId, articleId, userId }: CreateCommentData) {
    const newComment = await prisma.comment.create({
      data: {
        content,
        productId: productId || null,
        articleId: articleId || null,
        userId,
      },
    });
    return newComment;
  },

  async updateComment(id: number, updateData: UpdateCommentData, userId: number) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      const error: CustomError = new Error("존재하지 않는 댓글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (comment.userId != userId) {
      const error: CustomError = new Error("댓글을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    return await prisma.comment.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteComment(id: number, userId: number) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      const error: CustomError = new Error("존재하지 않는 댓글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (comment.userId != userId) {
      const error: CustomError = new Error("댓글을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    return await prisma.comment.delete({
      where: { id },
    });
  },

  async findManyComment({ productId, articleId, cursor: inputCursor, limit }: FindManyCommentParams) {
    let where: Prisma.CommentWhereInput = {};

    if (productId) {
      where.productId = productId;
    } else if (articleId) {
      where.articleId = articleId;
    }

    let skip;
    let prismaCursor: Prisma.CommentWhereUniqueInput | undefined;

    if (inputCursor) {
      skip = 1;
      prismaCursor = { id: Number(inputCursor) };
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { id: "asc" },
      take: limit,
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      ...(skip !== undefined && { skip }),
      ...(prismaCursor && { cursor: prismaCursor }),
    });
    return comments;
  },
};

export default CommentService;
