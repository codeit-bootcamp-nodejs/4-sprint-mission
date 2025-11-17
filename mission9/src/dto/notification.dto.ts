export interface NotificationDTO {
  id: number;
  type: "UNREAD" | "IS_READ";
  content: string;
  createdAt: Date;
  receiverId: number;
  senderId: number;
  category: "NEW_COMMENT" | "NEW_LIKE" | "CHANGED_PRICE";
}

export interface NotificationQuery {
  page: number;
  take: number;
  type: "UNREAD" | "IS_READ";
  category: "NEW_COMMENT" | "NEW_LIKE" | "CHANGED_PRICE";
}
