import prisma from '../index';
import { Comment as PrismaComment, Prisma } from '@prisma/client';

class CommentRepository {
  async findCommentById(id: number): Promise<PrismaComment | null> {
    return prisma.comment.findUnique({ where: { id } });
  }

  async findComments(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }): Promise<PrismaComment[]> {
    return prisma.comment.findMany(options);
  }

  async createComment(data: Prisma.CommentCreateInput): Promise<PrismaComment> {
    return prisma.comment.create({ data });
  }

  async updateComment(id: number, data: Prisma.CommentUpdateInput): Promise<PrismaComment> {
    return prisma.comment.update({ where: { id }, data });
  }

  async deleteComment(id: number): Promise<PrismaComment> {
    return prisma.comment.delete({ where: { id } });
  }
}

export default CommentRepository;
