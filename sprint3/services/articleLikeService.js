import prisma from "../lib/prisma.js";

export const toggleArticleLike = async (userId, articleId) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      const error = new Error("존재하지 않는 게시글입니다.");
      error.status = 400;
      throw error;
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      });

      return { liked: false };
    } else {
      await prisma.like.create({
        data: {
          userId,
          articleId,
          like: true,
        },
      });

      return { liked: true };
    }
  } catch (err) {
    throw err;
  }
};
