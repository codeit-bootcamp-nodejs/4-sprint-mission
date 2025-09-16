import prisma from "../lib/prisma.js";
import type {
  CreateProductCommentInput,
  CreateProductCommentResult,
  UpdateProductCommentInput,
  UpdateProductCommentResult,
  DeleteProductCommentInput,
  DeleteProductCommentResult,
  ListProductCommentInput,
  ListProductCommentResult,
  GetProductCommentByIdInput,
  GetProductCommentByIdResult,
} from "../types/service/product-comment.service.types.js";

export const createProductComment = async (
  data: CreateProductCommentInput
): Promise<CreateProductCommentResult> => {
  return prisma.productComment.create({
    data,
  });
};

export const updateProductComment = async (
  data: UpdateProductCommentInput
): Promise<UpdateProductCommentResult> => {
  return prisma.productComment.update({
    where: { id: data.commentId },
    data: {
      content: data.content,
      productId: data.productId,
    },
  });
};

export const deleteProductComment = async (
  data: DeleteProductCommentInput
): Promise<DeleteProductCommentResult> => {
  return prisma.productComment.delete({
    where: { id: data.commentId },
  });
};

export const listProductComment = async ({
  productId,
  cursor,
  limit,
}: ListProductCommentInput): Promise<ListProductCommentResult> => {
  return prisma.productComment.findMany({
    where: {
      productId,
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

export const getProductCommentById = async (
  data: GetProductCommentByIdInput
): Promise<GetProductCommentByIdResult> => {
  return prisma.productComment.findUnique({
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
