import prisma from "./prisma";

export async function findUniqueArticle({ id, user }: Article.Delete) {
  const articleId = id;
  return await prisma.like.findUnique({
    where: { articleId_userId: { articleId, userId: user.id } },
  });
}

export async function deleteArticleLikeRepo({ id, user }: Article.Delete) {
  const articleId = id;
  await prisma.like.delete({
    where: { articleId_userId: { articleId, userId: user.id } },
  });
}

export async function ArticleLikeRepo({ id, user }: Article.Delete) {
  const articleId = id;
  await prisma.like.create({
    data: {
      articleId,
      userId: user.id,
    },
  });
}

export async function findUniqeProduct({ id, user }: Article.Delete) {
  const productId = id;
  return await prisma.like.findUnique({
    where: { productId_userId: { productId, userId: user.id } },
  });
}
