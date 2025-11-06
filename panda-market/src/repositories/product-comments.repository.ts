import type { UpdateDTO } from '@/dto/base-comments.dto.js';
import type { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { CommentId } from '@/types/base-comment.typs.js';
import { GetCommentListParams } from '@/dto/product-comments.dto.js';
import { UserId } from '@/types/user.types.js';

@injectable()
export class ProductCommentRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async findOwnerById({ commentId }: CommentId) {
    return await this.prisma.productComment.findUniqueOrThrow({
      where: { id: commentId },
      select: { userId: true },
    });
  }
  async findMany({ cursorId, productId, pageSize }: GetCommentListParams) {
    const options: Prisma.ProductCommentFindManyArgs = {
      where: { productId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
    };
    if (cursorId) {
      options.cursor = {
        id: cursorId,
      };
      options.skip = 1;
    }
    return await this.prisma.productComment.findMany(options);
  }
  async findManyByUserId({ userId }: UserId) {
    return await this.prisma.productComment.findMany({
      where: { userId },
    });
  }
  async create(data: Prisma.ProductCommentCreateInput) {
    return await this.prisma.productComment.create({
      data,
      include: {
        product: true,
      },
    });
  }
  async update({ commentId, patchData: data }: UpdateDTO) {
    return await this.prisma.productComment.update({
      where: { id: commentId },
      data,
    });
  }
  async delete({ commentId }: CommentId) {
    return await this.prisma.productComment.delete({
      where: { id: commentId },
    });
  }
}
