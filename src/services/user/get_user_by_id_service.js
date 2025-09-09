import prisma from "../prisma.js";

export async function getUserByIdService(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      comment: true,
      article: true,
      product: true,
    },
  });
  if (!user || user.length === 0) throw new Error("NOT FOUND");

  //   const likeArticle = await prisma.user.findMany({
  //     select: { article },
  //   });

  return user;
}
