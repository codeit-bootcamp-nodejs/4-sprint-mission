import type { UserId } from '@/types/user.types.js';
import type { Prisma } from '@prisma/client';
import { BaseUserType } from '@/types/user.types.js';

export interface PatchUserParams extends UserId {
  data: Partial<BaseUserType>;
}

export interface UpdateDTO extends UserId {
  updateData: Prisma.UserUpdateInput;
}
