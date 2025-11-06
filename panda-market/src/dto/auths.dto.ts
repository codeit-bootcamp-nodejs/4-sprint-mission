import type { UserId } from '@/types/user.types.js';
import { Transaction } from '@/types/shared.types.js';
import { Prisma } from '@prisma/client';

export interface SignupDTO {
  email: string;
  nickname: string;
  hashedPassword: string;
}

export type FindByEmailDTO = {
  received_email: string;
};

export interface FindByIdDTO extends UserId, Transaction {}

export interface FindByProviderIdDTO extends Transaction {
  providerId: string;
}

export interface CreateDTO extends Transaction {
  createData: Prisma.UserCreateInput;
}

export interface UpdateDTO extends UserId, Transaction {
  refreshToken: string;
}
