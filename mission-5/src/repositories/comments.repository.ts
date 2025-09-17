import type {
  CreateDTO,
  DeleteDTO,
  FindByIdDTO,
  FindManyDTO,
  UpdateDTO,
} from '@/dto/comments.dto.js';
import type { PrismaClient } from '@prisma/client';

export class CommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOwnerById({ commentId }: FindByIdDTO) {
    return await this.prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
      select: { userId: true },
    });
  }
  async create({ userId, parentId, singularParentType, content }: CreateDTO) {
    return await this.prisma.comment.create({
      data: {
        content,
        [`${singularParentType}Id`]: parentId,
        userId,
      },
      include: {
        [singularParentType]: true,
      },
    });
  }
  async findMany({ query }: FindManyDTO) {
    return await this.prisma.comment.findMany(query);
  }
  async update({ commentId, content }: UpdateDTO) {
    return await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }
  async delete({ commentId }: DeleteDTO) {
    return await this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
