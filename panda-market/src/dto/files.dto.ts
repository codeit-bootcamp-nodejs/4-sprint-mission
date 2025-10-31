import type { EntityId, UserId } from '@/types/shared.type.js';
import type { Prisma } from '@prisma/client';

export interface findByIdDTO extends EntityId {
  tx?: Prisma.TransactionClient;
}

export interface CreateDTO extends UserId {
  secure_url: string;
  public_id: string;
}

export interface DeleteDTO extends EntityId {
  tx?: Prisma.TransactionClient;
}
