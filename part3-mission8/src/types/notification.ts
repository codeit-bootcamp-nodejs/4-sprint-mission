import type { NotificationType as PrismaNotificationType } from '@prisma/client';

import { NotificationType as NotificationTypeValues } from '@prisma/client';

export type NotificationType = PrismaNotificationType;

export { NotificationTypeValues };

export type NotificationCreateInput = {
  userId: number;
  type: NotificationType;
  message: string;
  productId?: number | null;
  articleId?: number | null;
  commentId?: number | null;
};
