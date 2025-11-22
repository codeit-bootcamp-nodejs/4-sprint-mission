export type NotificationType = 'PRICE_CHANGE' | 'NEW_COMMENT';

export interface CreateNotificationData {
    type: NotificationType;
    message: string;
    userId: number;
    productId?: number;
    postId?: number;
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
    post?: {
        id: number;
        title: string;
    } | null;
    comment?: {
        id: number;
        content: string;
    } | null;
}
