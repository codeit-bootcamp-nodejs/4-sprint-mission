import { CommentRepository } from '../repository/comment-repository';
import { CreateCommentDto, UpdateCommentDto } from '../types/dto';

export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  createComment = async (
    userId: number,
    createCommentDto: CreateCommentDto,
    productId: string | undefined,
    articleId: string | undefined,
  ) => {
    const { content } = createCommentDto;
    return await this.commentRepository.createComment(
      userId,
      content,
      productId,
      articleId,
    );
  };

  getComments = async (
    productId: string | undefined,
    articleId: string | undefined,
    limit: number,
    cursor: number | undefined,
  ) => {
    const where = {
      productId: productId ? parseInt(productId) : undefined,
      articleId: articleId ? parseInt(articleId) : undefined,
    };

    const comments = await this.commentRepository.findManyComments(
      where,
      limit,
      cursor,
    );

    const nextCursor =
      comments.length === limit ? comments[comments.length - 1].id : null;

    return { data: comments, nextCursor };
  };

  updateComment = async (
    userId: number,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) => {
    const { content } = updateCommentDto;
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new Error('댓글을 수정할 권한이 없습니다.');
    }
    return await this.commentRepository.updateComment(commentId, content);
  };

  deleteComment = async (userId: number, commentId: string) => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new Error('댓글을 삭제할 권한이 없습니다.');
    }
    await this.commentRepository.deleteComment(commentId);
  };

  getCommentById = async (commentId: string) => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    return comment;
  };
}