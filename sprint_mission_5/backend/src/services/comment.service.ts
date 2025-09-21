import { CommentRepository } from '../repositories/index.js';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentResponseDto,
  CommentListResponseDto,
  CommentQueryDto,
} from '../dto/index.js';

export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async createComment(
    commentData: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    if (!commentData.productId && !commentData.articleId) {
      throw new Error('상품 ID 또는 게시글 ID가 필요합니다.');
    }

    if (commentData.productId && commentData.articleId) {
      throw new Error('상품 댓글과 게시글 댓글을 동시에 생성할 수 없습니다.');
    }

    return await this.commentRepository.create(commentData);
  }

  async getCommentById(id: number): Promise<CommentResponseDto | null> {
    return await this.commentRepository.findById(id);
  }

  async getProductComments(
    productId: number,
    query: CommentQueryDto,
  ): Promise<CommentListResponseDto> {
    const result = await this.commentRepository.findByProductId(
      productId,
      query,
    );
    return {
      list: result.comments,
      totalCount: result.totalCount,
    };
  }

  async getArticleComments(
    articleId: number,
    query: CommentQueryDto,
  ): Promise<CommentListResponseDto> {
    const result = await this.commentRepository.findByArticleId(
      articleId,
      query,
    );
    return {
      list: result.comments,
      totalCount: result.totalCount,
    };
  }

  async updateComment(
    id: number,
    commentData: UpdateCommentDto,
    userId: number,
  ): Promise<CommentResponseDto> {
    const hasPermission = await this.commentRepository.checkOwnership(
      id,
      userId,
    );
    if (!hasPermission) {
      throw new Error('해당 댓글을 수정할 권한이 없습니다.');
    }

    return await this.commentRepository.update(id, commentData);
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const hasPermission = await this.commentRepository.checkOwnership(
      id,
      userId,
    );
    if (!hasPermission) {
      throw new Error('해당 댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentRepository.delete(id);
  }
}
