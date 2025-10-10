import { Prisma, PrismaClient } from '@prisma/client';

export class CommentRepository {
  constructor(private prisma: PrismaClient) {}

  createComment = async (
    userId: number,
    content: string,
    productId: string | undefined,
    articleId: string | undefined,
  ) => {
    return await this.prisma.comment.create({
      data: {
        userId,
        content,
        productId: productId ? parseInt(productId) : undefined,
        articleId: articleId ? parseInt(articleId) : undefined,
      },
    });
  };

  findManyComments = async (
    where: Prisma.CommentWhereInput,
    limit: number,
    cursor: number | undefined,
  ) => {
    return await this.prisma.comment.findMany({
      where,
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true },
    });
  };

  findCommentById = async (commentId: string) => {
    return await this.prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
  };

  updateComment = async (commentId: string, content: string) => {
    return await this.prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
  };

  deleteComment = async (commentId: string) => {
    await this.prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
  };
}