import prisma from "../prisma.js";

export async function getUserService() {
  const user = await prisma.user.findMany({
    include: {
      comment: true,
      article: true,
      product: true,
    },
  });
  if (!user || user.length === 0) throw new Error("NOT FOUND");

  //   const likeArticle = await prisma.user.findMany({
  //    select: {article}
  //   });

  return user;
}
