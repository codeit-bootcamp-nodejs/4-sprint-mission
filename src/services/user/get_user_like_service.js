import prisma from "../prisma.js";

export async function getUserLikeService(user) {
  const userId = user.id;
  const articles = await prisma.like.findMany({
    where: { userId },
    select: { article: true },
  });

  const likeArticles = articles
    .map((l) => l.article)
    .filter((article) => article !== null);

  const products = await prisma.like.findMany({
    where: { userId },
    select: { product: true },
  });

  const likeProducts = products
    .map((l) => l.product)
    .filter((product) => product !== null);

  return { likeArticles, likeProducts };
}
