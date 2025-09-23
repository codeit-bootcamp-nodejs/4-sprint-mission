import prisma from '@config/prisma.js';

/** 상품 좋아요 토글 */
export const toggleProductLike = async (
  authorId: number,
  productId: number,
) => {
  const existing = await prisma.like.findUnique({
    where: { authorId_productId: { authorId, productId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return false; // 좋아요 취소
  } else {
    await prisma.like.create({ data: { authorId, productId } });
    return true; // 좋아요
  }
};
