import prisma from '@lib/prisma.js';
import type {
  CreateDTO,
  DeleteDTO,
  FindByIdDTO,
  FindManyDTO,
  UpdateDTO,
} from '@/dto/comments.dto.js';

class CommentRepository {
  async findOwnerById({ commentId }: FindByIdDTO) {
    return await prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
      select: { userId: true },
    });
  }
  async create({ userId, parentId, singularParentType, content }: CreateDTO) {
    return await prisma.comment.create({
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
    return await prisma.comment.findMany(query);
  }
  async update({ commentId, content }: UpdateDTO) {
    return await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }
  async delete({ commentId }: DeleteDTO) {
    return await prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
export default new CommentRepository();
