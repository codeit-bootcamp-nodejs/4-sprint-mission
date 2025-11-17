import prisma from "../lib/prisma.js";

export class Helper {
  async findProductById(id: number) {
    const result = await prisma.product.findUnique({
      where: { id },
    });
    return result;
  }

  async findArticleById(id: number) {
    const result = await prisma.article.findUnique({
      where: { id },
      include: {
        comments: true,
      },
    });
    return result;
  }

  async findCommentById(id: number) {
    const result = await prisma.comment.findUnique({
      where: { id },
    });
    return result;
  }
}
