import { Transaction } from '@/types/shared.types.js';
import { Prisma } from '@prisma/client';

export interface CreateDTO extends Transaction {
  createData: Prisma.NotificationCreateInput;
}

export interface CreateManyDTO extends Transaction {
  createData: Prisma.NotificationCreateManyInput[];
}

export interface RecipientId {
  recipientId: number;
}

export interface NotificationId {
  notificationId: number;
}

export interface UpdateReadParams extends RecipientId, NotificationId {}
