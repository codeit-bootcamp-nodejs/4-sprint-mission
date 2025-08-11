import prisma from '../prismaClient.js';

const commentService = {
  async createProductComment(productId, data) {
    const productComments = await prisma.comment.create({
      data: {
        content: data.content,
        productId: productId,
      },
    });
    return productComments;
  },
  async createArticleComment(articleId, data) {
    const articleComments = await prisma.comment.create({
      data: {
        content: data.content,
        articleId: articleId,
      },
    });
    return articleComments;
  },

  async updateProductComment(id, data) {
    const pdCommentPatched = await prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
      },
    });
    return pdCommentPatched;
  },
  async updateArticleComment(id, data) {
    const atcCommentPatched = await prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
      },
    });
    return atcCommentPatched;
  },

  async deleteProductComment(id) {
    const productComments = await prisma.comment.delete({
      where: { id },
    });
    return productComments;
  },
  async deleteArticleComment(id) {
    const articleComments = await prisma.comment.delete({
      where: { id },
    });
    return articleComments;
  },

  async listProductComment(id, { cursor, limit }) {
    const productComments = await prisma.comment.findMany({
      where: {
        productId: id,
        ...(cursor && {
          createdAt: {
            lt: new Date(cursor),
          },
        }),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    return productComments;
  },
  async listArticleComment(id, { cursor, limit }) {
    const articleComments = await prisma.comment.findMany({
      where: {
        articleId: id,
        ...(cursor && {
          createdAt: {
            lt: new Date(cursor),
          },
        }),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    return articleComments;
  },
};

export default commentService;
