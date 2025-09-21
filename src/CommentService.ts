import { Comment as PrismaComment, Prisma } from '@prisma/client';
import CommentRepository from './repositories/CommentRepository';

interface CommentCreateInput {
  content: string;
  userId: number;
  productId?: number;
  articleId?: number;
}

interface CommentUpdateInput {
  content?: string;
}

class CommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  async createComment(data: CommentCreateInput): Promise<PrismaComment> {
    const { userId, productId, articleId, ...rest } = data;
    return this.commentRepository.createComment({
      ...rest,
      user: { connect: { id: userId } },
      ...(productId && { product: { connect: { id: productId } } }),
      ...(articleId && { article: { connect: { id: articleId } } }),
    });
  }

  async getCommentById(id: number): Promise<PrismaComment | null> {
    return this.commentRepository.findCommentById(id);
  }

  async getComments(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }): Promise<PrismaComment[]> {
    return this.commentRepository.findComments(options);
  }

  async updateComment(id: number, data: CommentUpdateInput): Promise<PrismaComment> {
    return this.commentRepository.updateComment(id, data);
  }

  async deleteComment(id: number): Promise<PrismaComment> {
    return this.commentRepository.deleteComment(id);
  }
}

export default CommentService;
