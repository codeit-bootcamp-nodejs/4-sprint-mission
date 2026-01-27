import { prisma } from "../prisma/client.js";

// 상품 좋아요 / 취소
export async function toggleProductLike(req, res) {
  const productId = parseInt(req.params.productId);
  const existing = await prisma.productLike.findUnique({
    where: { userId_productId: { userId: req.user.id, productId } },
  });

  if (existing) {
    await prisma.productLike.delete({ where: { id: existing.id } });
    return res.json({ liked: false });
  }

  await prisma.productLike.create({ data: { userId: req.user.id, productId } });
  return res.json({ liked: true });
}

// 게시글 좋아요 / 취소
export async function togglePostLike(req, res) {
  const postId = parseInt(req.params.postId);
  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId: req.user.id, postId } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    return res.json({ liked: false });
  }

  await prisma.postLike.create({ data: { userId: req.user.id, postId } });
  return res.json({ liked: true });
}
