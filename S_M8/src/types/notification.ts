export type NotificationDTO = {
id: number;
userId: number;
type: string;
message: string;
payload?: any;
isRead: boolean;
createdAt: string;
};