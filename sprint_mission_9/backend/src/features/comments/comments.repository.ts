import { PrismaClient, Prisma } from '@prisma/client';
import { PaginationParams } from '../../shared/types/models';
import { CreateCommentInput, UpdateCommentInput } from './comments.dto';

export interface CommentFilter {
  productId?: number;
  articleId?: number;
}

export class CommentsRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateCommentInput) {
    return this.prisma.comment.create({
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

  async findById(id: number) {
    return this.prisma.comment.findUnique({
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

  async findMany(filter: CommentFilter & PaginationParams) {
    const { page = 1, limit = 10, productId, articleId } = filter;

    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = {
      ...(productId && { productId }),
      ...(articleId && { articleId }),
    };

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      this.prisma.comment.count({ where }),
    ]);

    return {
      data: comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, data: UpdateCommentInput) {
    return this.prisma.comment.update({
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

  async delete(id: number) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }

  async isOwner(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });
    return comment?.userId === userId;
  }
}
