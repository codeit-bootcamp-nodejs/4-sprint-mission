import * as articlesRepository from '../repositories/articlesRepository';
import * as commentsRepository from '../repositories/commentsRepository';
import * as productsRepository from '../repositories/productsRepository';
import * as notificationsService from './notificationsService';
import { CursorPaginationParams, CursorPaginationResult } from '../types/pagination';
import BadRequestError from '../lib/errors/BadRequestError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import Comment from '../types/Comment';

type CreateCommentData = Omit<
  Comment,
  'id' | 'productId' | 'articleId' | 'createdAt' | 'updatedAt'
> & {
  productId?: number;
  articleId?: number;
};

export async function createComment(data: CreateCommentData): Promise<Comment> {
  if (!data.articleId && !data.productId) {
    throw new BadRequestError('Either articleId or productId must be provided');
  }

  let articleOwnerId: number | null = null;
  let productOwnerId: number | null = null;

  if (data.articleId) {
    const article = await articlesRepository.getArticle(data.articleId);
    if (!article) {
      throw new NotFoundError('article', data.articleId);
    }
    articleOwnerId = article.userId;
  }

  if (data.productId) {
    const product = await productsRepository.getProduct(data.productId);
    if (!product) {
      throw new NotFoundError('product', data.productId);
    }
    productOwnerId = product.userId;
  }

  const comment = await commentsRepository.createComment({
    ...data,
    articleId: data.articleId ?? null,
    productId: data.productId ?? null,
  });

  // 알림 전송 (비동기, 별도 처리)
  // 게시글 댓글 알림
  if (data.articleId && articleOwnerId && articleOwnerId !== data.userId) {
    notificationsService
      .createAndSendNotification({
        type: 'NEW_COMMENT',
        message: `내가 작성한 게시글에 새로운 댓글이 달렸습니다.`,
        userId: articleOwnerId,
        articleId: data.articleId,
        commentId: comment.id,
      })
      .catch((error) => {
        console.error('Failed to send article comment notification:', error);
      });
  }

  // 상품 댓글 알림
  if (data.productId && productOwnerId && productOwnerId !== data.userId) {
    notificationsService
      .createAndSendNotification({
        type: 'NEW_COMMENT',
        message: `내가 등록한 상품에 새로운 댓글이 달렸습니다.`,
        userId: productOwnerId,
        productId: data.productId,
        commentId: comment.id,
      })
      .catch((error) => {
        console.error('Failed to send product comment notification:', error);
      });
  }

  return comment;
}

export async function getComment(id: number): Promise<Comment | null> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('comment', id);
  }
  return comment;
}

export async function getCommentListByArticleId(
  articleId: number,
  params: CursorPaginationParams,
): Promise<CursorPaginationResult<Comment>> {
  const article = await articlesRepository.getArticle(articleId);
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const result = commentsRepository.getCommentList({ articleId }, params);
  return result;
}

export async function getCommentListByProductId(
  productId: number,
  params: CursorPaginationParams,
): Promise<CursorPaginationResult<Comment>> {
  const product = await productsRepository.getProduct(productId);
  if (!product) {
    throw new NotFoundError('product', productId);
  }

  const result = commentsRepository.getCommentList({ productId }, params);
  return result;
}

export async function updateComment(id: number, userId: number, content: string): Promise<Comment> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('comment', id);
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  return commentsRepository.updateComment(id, { content });
}

export async function deleteComment(id: number, userId: number): Promise<void> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('comment', id);
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  await commentsRepository.deleteComment(id);
}
