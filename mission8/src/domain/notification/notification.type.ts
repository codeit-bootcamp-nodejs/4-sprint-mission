import type { NotificationTargetType, NotificationTypeEnum } from '../../../generated/prisma/enums.js';

export interface CreateManyNotificationInput {
  userIds: number[];
  type: NotificationTypeEnum;
  targetType: NotificationTargetType;
  targetId: number;
  message: string;
}

export interface CreateNotificationInput {
  userId: number;
  type: NotificationTypeEnum;
  targetType: NotificationTargetType;
  targetId: number;
  message: string;
}

export interface GetListInput {
  userId: number;
  page: number;
  limit: number;
}
