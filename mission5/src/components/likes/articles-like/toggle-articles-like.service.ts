import prisma from '@config/prisma.js';

/** 게시글 좋아요 토글 */
export const toggleArticleLike = async (
  authorId: number,
  articleId: number,
) => {
  const existing = await prisma.like.findUnique({
    where: { authorId_articleId: { authorId, articleId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return false;
  } else {
    await prisma.like.create({ data: { authorId, articleId } });
    return true; // 좋아요
  }
};
