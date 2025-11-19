import { CommentsRepository, CommentFilter } from './comments.repository';
import { PaginationParams } from '../../shared/types/models';
import { CreateCommentInput, UpdateCommentInput, GetCommentsQuery } from './comments.dto';

export class CommentsService {
  constructor(private repository: CommentsRepository) {}

  async getComments(query: GetCommentsQuery) {
    const filter: CommentFilter & PaginationParams = {
      page: query.page,
      limit: query.limit,
      productId: query.productId,
      articleId: query.articleId,
    };

    return this.repository.findMany(filter);
  }

  async getCommentById(id: number) {
    const comment = await this.repository.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }

  async createComment(data: CreateCommentInput) {
    return this.repository.create(data);
  }

  async updateComment(id: number, data: UpdateCommentInput, userId: number) {
    const isOwner = await this.repository.isOwner(id, userId);
    if (!isOwner) {
      throw new Error('해당 댓글을 수정할 권한이 없습니다.');
    }

    return this.repository.update(id, data);
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const isOwner = await this.repository.isOwner(id, userId);
    if (!isOwner) {
      throw new Error('해당 댓글을 삭제할 권한이 없습니다.');
    }

    await this.repository.delete(id);
  }
}
