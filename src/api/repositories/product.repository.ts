import prisma from "../libs/prismaClient.js";
import type { FindManyProductParams } from "../types/product.js";
import { Prisma } from "@prisma/client";

export const create = async (data: Prisma.ProductCreateInput) => {
  return await prisma.product.create({ data });
};

export const findById = async (productId: number) => {
  return await prisma.product.findUnique({
    where: { id: productId },
  });
};

export const findLikeByUserAndProduct = async (userId: number, productId: number) => {
  return await prisma.like.findFirst({
    where: { userId, productId },
  });
};

export const update = async (id: number, data: Prisma.ProductUpdateInput) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number) => {
  return await prisma.product.delete({
    where: { id },
  });
};

export const findMany = async ({ offset, limit, order, keyword }: FindManyProductParams) => {
  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (order) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "recent":
    default:
      orderBy = { createdAt: "desc" };
  }

  let where = {};
  if (keyword) {
    where = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }
  return await prisma.product.findMany({
    select: { id: true, name: true, price: true, createdAt: true },
    skip: offset,
    take: limit,
    orderBy,
    where,
  });
};
