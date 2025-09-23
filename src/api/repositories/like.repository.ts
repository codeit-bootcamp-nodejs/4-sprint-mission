import prisma from "../libs/prismaClient.js";
import { Prisma } from "@prisma/client";

export const findFirst = async (where: Prisma.LikeWhereInput) => {
  return await prisma.like.findFirst({ where });
};

export const create = async (data: Prisma.LikeCreateInput) => {
  return await prisma.like.create({ data });
};

export const remove = async (id: number) => {
  return await prisma.like.delete({ where: { id } });
};
