import prisma from "../lib/prisma.js";
import type {
  CreateArticleCommentInput,
  CreateArticleCommentResult,
  UpdateArticleCommentInput,
  UpdateArticleCommentResult,
  DeleteArticleCommentInput,
  DeleteArticleCommentResult,
  ListArticleCommentInput,
  ListArticleCommentResult,
  GetArticleCommentByIdInput,
  GetArticleCommentByIdResult,
} from "../types/service/article-comment.service.types.js";

export const createArticleComment = async (
  data: CreateArticleCommentInput
): Promise<CreateArticleCommentResult> => {
  return prisma.articleComment.create({
    data,
  });
};

export const updateArticleComment = async (
  data: UpdateArticleCommentInput
): Promise<UpdateArticleCommentResult> => {
  return prisma.articleComment.update({
    where: { id: data.commentId },
    data: {
      content: data.content,
      articleId: data.articleId,
    },
  });
};

export const deleteArticleComment = async (
  data: DeleteArticleCommentInput
): Promise<DeleteArticleCommentResult> => {
  return prisma.articleComment.delete({
    where: { id: data.commentId },
  });
};

export const listArticleComment = async ({
  articleId,
  cursor,
  limit,
}: ListArticleCommentInput): Promise<ListArticleCommentResult> => {
  return prisma.articleComment.findMany({
    where: {
      articleId,
      ...(cursor
        ? {
            createdAt: {
              lt: new Date(Number(cursor)),
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    ...(limit !== undefined ? { take: limit } : {}), // ✅ undefined일 땐 프로퍼티 자체를 제거
  });
};

export const getArticleCommentById = async (
  data: GetArticleCommentByIdInput
): Promise<GetArticleCommentByIdResult> => {
  return prisma.articleComment.findUnique({
    where: { id: data.commentId },
    include: {
      User: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
};
