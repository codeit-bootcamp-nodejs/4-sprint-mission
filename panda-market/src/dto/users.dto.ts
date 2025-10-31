import type { GetListParams, Options, singularContentType, UserId } from '@/types/shared.type.js';
import type { Prisma } from '@prisma/client';

export interface UpdateDTO extends UserId {
  updateData: Prisma.UserUpdateInput;
}

export type FindByIdDTO = UserId;

export type FindManyDTO = GetListParams;

export type DeleteDTO = UserId; // eslint 오류 방지

export interface findManyContentDTO extends UserId {
  options: Options;
}
export interface findManyLikeContentDTO extends UserId {
  singularContentType: singularContentType;
}
