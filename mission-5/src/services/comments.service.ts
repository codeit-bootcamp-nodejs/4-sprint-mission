import { CommentsRepository } from '../repositories/comments.repository.js';
import { Prisma } from '@prisma/client';

export class CommentsService {
  commentsRepository = new CommentsRepository();

  createArticleComment = async (articleId: number, content: string, userId: number) => {
    if (!content) {
      const err = new Error("댓글 내용을 입력해주세요.");
      err.name = "BadRequestError";
      throw err;
    }

    const article = await this.commentsRepository.findArticleById(articleId);
    if (!article) {
      const err = new Error("게시글을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }

    const newComment = await this.commentsRepository.createArticleComment(
      userId,
      articleId,
      content,
    );
    return newComment;
  };

  createProductComment = async (productId: number, content: string, userId: number) => {
    if (!content) {
      const err = new Error("댓글 내용을 입력해주세요.");
      err.name = "BadRequestError";
      throw err;
    }

    const product = await this.commentsRepository.findProductById(productId);
    if (!product) {
      const err = new Error("상품을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
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
      const err = new Error("게시글을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }

    const comments = await this.commentsRepository.findCommentsByArticleId(articleId);
    return comments;
  };

  getProductComments = async (productId: number) => {
    const product = await this.commentsRepository.findProductById(productId);
    if (!product) {
      const err = new Error("상품을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }

    const comments = await this.commentsRepository.findCommentsByProductId(productId);
    return comments;
  };

  updateComment = async (commentId: number, content: string, userId: number) => {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      const err = new Error("댓글을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }
    if (comment.authorId !== userId) {
      const err = new Error("댓글을 수정할 권한이 없습니다.");
      err.name = "ForbiddenError";
      throw err;
    }

    if (!content) {
      const err = new Error("수정할 내용을 입력해주세요.");
      err.name = "BadRequestError";
      throw err;
    }

    const updatedComment = await this.commentsRepository.updateComment(commentId, content);
    return updatedComment;
  };

  deleteComment = async (commentId: number, userId: number) => {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      const err = new Error("댓글을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }
    if (comment.authorId !== userId) {
      const err = new Error("댓글을 삭제할 권한이 없습니다.");
      err.name = "ForbiddenError";
      throw err;
    }

    await this.commentsRepository.deleteComment(commentId);
  };
}
