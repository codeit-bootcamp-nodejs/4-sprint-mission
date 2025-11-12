import type { NotificationTypeEnum } from '../../../generated/prisma/enums.js';

export interface CreateNotificationDto {
  userId: number;
  type: NotificationTypeEnum;
  productId: number;
  message: string;
}
