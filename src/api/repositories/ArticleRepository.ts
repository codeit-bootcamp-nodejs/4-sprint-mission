import prisma from "../libs/prismaClient.js";
import { Prisma } from "@prisma/client";
import type { FindManyArticleParams } from "../types/article.js";

// 게시글 생성
export const create = async (data: Prisma.ArticleCreateInput) => {
  return await prisma.article.create({ data });
};

// ID로 게시글 조회
export const findById = async (id: number) => {
  return await prisma.article.findUnique({ where: { id } });
};

// 여러 게시글 조회
export const findMany = async ({ offset, limit, order, keyword }: FindManyArticleParams) => {
  let orderBy: Prisma.ArticleOrderByWithRelationInput;
  switch (order) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "recent":
    default:
      orderBy = { createdAt: "desc" };
  }

  const where: Prisma.ArticleWhereInput = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  return await prisma.article.findMany({
    select: { id: true, title: true, content: true, createdAt: true },
    skip: offset,
    take: limit,
    orderBy,
    where,
  });
};

// 게시글 수정
export const update = async (id: number, data: Prisma.ArticleUpdateInput) => {
  return await prisma.article.update({
    where: { id },
    data,
  });
};

// 게시글 삭제
export const remove = async (id: number) => {
  return await prisma.article.delete({
    where: { id },
  });
};

// 특정 사용자가 특정 게시글에 좋아요 눌렀는지 확인
export const findLikeByUserAndArticle = async (userId: number, articleId: number) => {
  return await prisma.like.findFirst({
    where: { userId, articleId },
  });
};
