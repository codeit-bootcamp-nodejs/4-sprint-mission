import { Prisma } from '@prisma/client';

export interface TagInput {
  tx?: Prisma.TransactionClient;
  tags: string[];
}
