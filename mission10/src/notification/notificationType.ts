

export interface Notification {
    id: number;
    userId: number;
    message: string;
    isRead: boolean;
    createdAt: Date;
}