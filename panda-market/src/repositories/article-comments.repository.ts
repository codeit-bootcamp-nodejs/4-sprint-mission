import type { UpdateDTO } from '@/dto/base-comments.dto.js';
import type { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { CommentId } from '@/types/base-comment.typs.js';
import { GetCommentListParams } from '@/dto/article-comments.dto.js';
import { UserId } from '@/types/user.types.js';

@injectable()
export class ArticleCommentRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async findOwnerById({ commentId }: CommentId) {
    return await this.prisma.articleComment.findUniqueOrThrow({
      where: { id: commentId },
      select: { userId: true },
    });
  }
  async findMany({ cursorId, articleId, pageSize }: GetCommentListParams) {
    const options: Prisma.ArticleCommentFindManyArgs = {
      where: { articleId },
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
    return await this.prisma.articleComment.findMany(options);
  }
  async findManyByUserId({ userId }: UserId) {
    return await this.prisma.articleComment.findMany({
      where: { userId },
    });
  }
  async create(data: Prisma.ArticleCommentCreateInput) {
    return await this.prisma.articleComment.create({
      data,
      include: {
        article: true,
      },
    });
  }
  async update({ commentId, patchData: data }: UpdateDTO) {
    return await this.prisma.articleComment.update({
      where: { id: commentId },
      data,
    });
  }
  async delete({ commentId }: CommentId) {
    return await this.prisma.articleComment.delete({
      where: { id: commentId },
    });
  }
}
