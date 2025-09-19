import prisma from "../libs/prismaClient.js";
import { Prisma } from "@prisma/client";
import type { FindManyCommentsQuery } from "../services/comment/comment-findmany.dto.js";

export const create = async (data: Prisma.CommentCreateInput) => {
  return await prisma.comment.create({ data });
};

export const findById = async (id: number) => {
  return await prisma.comment.findUnique({
    where: { id },
  });
};

export const update = async (id: number, data: Prisma.CommentUpdateInput) => {
  return await prisma.comment.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number) => {
  return await prisma.comment.delete({ where: { id } });
};

export const findMany = async ({ productId, articleId, cursor, limit = 10 }: FindManyCommentsQuery) => {
  let where: Prisma.CommentWhereInput = {};

  if (productId) {
    where.productId = productId;
  } else if (articleId) {
    where.articleId = articleId;
  }

  let skip;
  let prismaCursor: Prisma.CommentWhereUniqueInput | undefined;

  if (cursor) {
    skip = 1;
    prismaCursor = { id: Number(cursor) };
  }

  const comments = await prisma.comment.findMany({
    where,
    orderBy: { id: "asc" },
    take: limit,
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    ...(skip !== undefined && { skip }),
    ...(prismaCursor && { cursor: prismaCursor }),
  });
  return comments;
};
