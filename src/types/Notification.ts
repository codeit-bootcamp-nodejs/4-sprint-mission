export enum NotificationType {
  PRICE_CHANGED = 'PRICE_CHANGED',
  NEW_COMMENT = 'NEW_COMMENT',
}

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  payload: any;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
