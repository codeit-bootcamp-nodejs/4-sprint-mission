import prisma from "./prisma";

export async function ArticleLikeService({ id, user }: Article.Delete) {
  const articleId = id;
  const alreadyLike = await prisma.like.findUnique({
    where: { articleId_userId: { articleId, userId: user.id } },
  });
  if (alreadyLike) {
    await prisma.like.delete({
      where: { articleId_userId: { articleId, userId: user.id } },
    });
    return { message: "좋아요가 취소되었습니다." };
  } else {
    const like = await prisma.like.create({
      data: {
        articleId,
        userId: user.id,
      },
    });
    return { message: "좋아요 성공" };
  }
}

export async function ProductLikeService({ id, user }: Article.Delete) {
  const productId = id;
  const alreadyLike = await prisma.like.findUnique({
    where: { productId_userId: { productId, userId: user.id } },
  });
  if (alreadyLike) {
    await prisma.like.delete({
      where: { productId_userId: { productId, userId: user.id } },
    });
    return { message: "좋아요가 취소되었습니다." };
  } else {
    const like = await prisma.like.create({
      data: {
        productId,
        userId: user.id,
      },
    });
    return { message: "좋아요 성공" };
  }
}
