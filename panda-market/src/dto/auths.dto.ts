import type { UserId } from '@/types/user.types.js';
import type { Prisma } from '@prisma/client';

export interface SignupDTO {
  email: string;
  nickname: string;
  hashedPassword: string;
}

export type findByEmailDTO = {
  received_email: string;
};

export interface FindByIdDTO extends UserId {
  tx?: Prisma.TransactionClient;
}

export interface UpdateDTO extends UserId {
  refreshToken: string;
  tx?: Prisma.TransactionClient;
}
