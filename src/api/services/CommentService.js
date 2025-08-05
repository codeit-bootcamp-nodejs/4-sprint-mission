import prisma from "../prismaClient.js";

const CommentService = {
  async createComment({ content, productId, articleId }) {
    const newComment = await prisma.comment.create({
      data: {
        content,
        productId: productId || null,
        articleId: articleId || null,
      },
    });
    return newComment;
  },

  async updateComment(id, updateData) {
    const comment = await prisma.comment.update({
      where: { id },
      data: updateData,
    });
    return comment;
  },

  async deleteComment(id) {
    await prisma.comment.delete({
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
