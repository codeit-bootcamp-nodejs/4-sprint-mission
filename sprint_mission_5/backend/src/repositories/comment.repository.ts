import { PrismaClient } from '@prisma/client';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentResponseDto,
  CommentQueryDto,
} from '../dto/index.js';

export class CommentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateCommentDto): Promise<CommentResponseDto> {
    return await this.prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<CommentResponseDto | null> {
    return await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  async findByProductId(
    productId: number,
    query: CommentQueryDto,
  ): Promise<{
    comments: CommentResponseDto[];
    totalCount: number;
  }> {
    const { limit = 10, cursor } = query;

    const where = {
      productId,
      ...(cursor && { id: { lt: cursor } }),
    };

    const [comments, totalCount] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where: { productId } }),
    ]);

    return {
      comments,
      totalCount,
    };
  }

  async findByArticleId(
    articleId: number,
    query: CommentQueryDto,
  ): Promise<{
    comments: CommentResponseDto[];
    totalCount: number;
  }> {
    const { limit = 10, cursor } = query;

    const where = {
      articleId,
      ...(cursor && { id: { lt: cursor } }),
    };

    const [comments, totalCount] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where: { articleId } }),
    ]);

    return {
      comments,
      totalCount,
    };
  }

  async update(
    id: number,
    data: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return await this.prisma.comment.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }

  async checkOwnership(id: number, userId: number): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { userId: true },
    });
    return comment?.userId === userId;
  }
}
