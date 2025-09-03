import prisma from "../libs/prismaClient.js";

const CommentService = {
  async createComment({ content, productId, articleId, userId }) {
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

  async updateComment(id, updateData, userId) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (comment.userId != userId) {
      const error = new Error("댓글을 수정할 권한이 없습니다.");
      error.status = 403;
      throw error;
    }

    return await prisma.comment.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteComment(id, userId) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (comment.userId != userId) {
      const error = new Error("댓글을 삭제할 권한이 없습니다.");
      error.status = 403;
      throw error;
    }

    return await prisma.comment.delete({
      where: { id },
    });
  },

  async findManyComment({ productId, articleId, cursor, limit }) {
    let where = {};
    if (productId) {
      where.productId = productId;
    } else {
      where.articleId = articleId;
    }

    let skip;
    if (cursor) {
      skip = 1;
      cursor = { id: Number(cursor) };
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { id: "asc" },
      take: parseInt(limit),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      skip,
      cursor,
    });
    return comments;
  },
};

export default CommentService;
