import type { NotificationType } from '../../src/types/notification.js';

export type NotificationRecord = {
  id: number;
  userId: number;
  articleId: number | null;
  productId: number | null;
  commentId: number | null;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function makeNotification(
  over: Partial<NotificationRecord> = {}
): NotificationRecord {
  return {
    id: 1,
    userId: 1,
    articleId: null,
    productId: null,
    commentId: null,
    type: 'NEW_COMMENT' as NotificationType,
    message: '알림',
    isRead: false,
    createdAt: new Date(),
    ...over,
  };
}

export type ArticleLite = {
  id: number;
  title: string;
  userId: number;
};

export type ProductLite = {
  id: number;
  name: string;
  userId: number;
};

export type CommentCore = {
  id: number;
  content: string;
  userId: number;
  user: { username: string };
  articleId: number | null;
  productId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

// 리스트 조회에서 사용하는 셀렉트 결과 타입
export type ListedComment = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: { username: string };
};

export type CommentLikeRecord = {
  id: number;
  userId: number;
  commentId: number;
  createdAt: Date;
};

export function makeArticleLite(over?: Partial<ArticleLite>): ArticleLite {
  return { id: 1, title: 'Title', userId: 10, ...over };
}

export function makeProductLite(over?: Partial<ProductLite>): ProductLite {
  return { id: 1, name: 'Prod', userId: 20, ...over };
}

export function makeComment(over?: Partial<CommentCore>): CommentCore {
  return {
    id: 100,
    content: 'hello',
    userId: 999,
    user: { username: 'user' },
    articleId: null,
    productId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

export function makeListedComment(
  over?: Partial<ListedComment>
): ListedComment {
  return {
    id: 200,
    content: 'listed',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { username: 'user' },
    ...over,
  };
}

export function makeCommentLike(
  over: Partial<CommentLikeRecord> = {}
): CommentLikeRecord {
  return {
    id: 1,
    userId: 1,
    commentId: 1,
    createdAt: new Date(),
    ...over,
  };
}
