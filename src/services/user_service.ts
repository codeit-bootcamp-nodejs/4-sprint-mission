import { User } from "@prisma/client";
import prisma from "./prisma";

export async function getUserByIdService(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      comment: true,
      article: true,
      product: true,
    },
  });
  if (!user) throw new Error("NOT FOUND");

  return user;
}

export async function getUserLikeService(user: User) {
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

export async function getUserService() {
  const user = await prisma.user.findMany({
    include: {
      comment: true,
      article: true,
      product: true,
    },
  });
  if (!user || user.length === 0) throw new Error("NOT FOUND");

  return user;
}

export async function updateUserService({ id, updateData }: Users.Update) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("NOT_FOUND");
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  return updatedUser;
}
