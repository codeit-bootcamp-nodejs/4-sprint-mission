import prisma from "./prisma";

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      comment: true,
      article: true,
      product: true,
    },
  });
}

export async function getArticles(userId: number) {
  return await prisma.like.findMany({
    where: { userId },
    select: { article: true },
  });
}

export async function getProducts(userId: number) {
  return await prisma.like.findMany({
    where: { userId },
    select: { product: true },
  });
}

export async function getUser() {
  return await prisma.user.findMany({
    include: {
      comment: true,
      article: true,
      product: true,
    },
  });
}

export async function findUniqueUser(id: number) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function updateUser({ id, updateData }: Users.Update) {
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
}
