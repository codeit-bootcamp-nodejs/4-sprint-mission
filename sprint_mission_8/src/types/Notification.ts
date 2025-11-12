export type NotificationType = 'PRICE_CHANGE' | 'NEW_COMMENT';

export default interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: number;
  productId?: number | null;
  articleId?: number | null;
  commentId?: number | null;
}

export interface CreateNotificationData {
  type: NotificationType;
  message: string;
  userId: number;
  productId?: number;
  articleId?: number;
  commentId?: number;
}

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  product?: {
    id: number;
    name: string;
  } | null;
  article?: {
    id: number;
    title: string;
  } | null;
  comment?: {
    id: number;
    content: string;
  } | null;
}
