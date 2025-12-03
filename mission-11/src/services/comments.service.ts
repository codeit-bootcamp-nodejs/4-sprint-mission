import { CommentsRepository } from '../repositories/comments.repository.js';
import { Prisma, NotificationType } from '@prisma/client';
import { NotificationsService } from './notifications.service.js';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto.js';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from '../errors/http-error.js';

export class CommentsService {
  commentsRepository = new CommentsRepository();
  notificationsService = NotificationsService.getInstance();

  createArticleComment = async (
    articleId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ) => {
    const { content } = createCommentDto;
    if (!content) {
      throw new BadRequestError('댓글 내용을 입력해주세요.');
    }

    const article = await this.commentsRepository.findArticleById(articleId);
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    const newComment = await this.commentsRepository.createArticleComment(
      userId,
      articleId,
      content,
    );

    // Notification for new comment on article
    if (article.authorId !== userId) {
      await this.notificationsService.createNotification(
        article.authorId,
        NotificationType.NEW_COMMENT,
        `작성하신 게시글 '${article.title}'에 새로운 댓글이 달렸습니다.`,
        undefined,
        articleId,
      );
    }

    return newComment;
  };

  createProductComment = async (
    productId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ) => {
    const { content } = createCommentDto;
    if (!content) {
      throw new BadRequestError('댓글 내용을 입력해주세요.');
    }

    const product = await this.commentsRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const newComment = await this.commentsRepository.createProductComment(
      userId,
      productId,
      content,
    );
    return newComment;
  };

  getArticleComments = async (articleId: number) => {
    const article = await this.commentsRepository.findArticleById(articleId);
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    const comments = await this.commentsRepository.findCommentsByArticleId(
      articleId,
    );
    return comments;
  };

  getProductComments = async (productId: number) => {
    const product = await this.commentsRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const comments = await this.commentsRepository.findCommentsByProductId(
      productId,
    );
    return comments;
  };

  updateComment = async (
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ) => {
    const { content } = updateCommentDto;
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenError('댓글을 수정할 권한이 없습니다.');
    }

    if (!content) {
      throw new BadRequestError('수정할 내용을 입력해주세요.');
    }

    const updatedComment = await this.commentsRepository.updateComment(
      commentId,
      content,
    );
    return updatedComment;
  };

  deleteComment = async (commentId: number, userId: number) => {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenError('댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentsRepository.deleteComment(commentId);
  };
}
