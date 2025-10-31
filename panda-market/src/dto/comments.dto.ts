import type { CommentId } from '@/types/comment.typs.js';
import type { SingularContentType, UserId } from '@/types/shared.type.js';
import type { Prisma } from '@prisma/client';

export type FindByIdDTO = CommentId;

export interface CreateDTO extends UserId {
  parentId: number;
  singularParentType: SingularContentType;
  content: string;
}

export interface FindManyDTO {
  query: Prisma.CommentFindManyArgs;
}

export interface UpdateDTO extends CommentId {
  content: string;
}

export type DeleteDTO = CommentId;
