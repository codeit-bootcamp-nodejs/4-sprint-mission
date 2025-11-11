import type { CommentId } from '@/types/base-comment.typs.js';
import { UserId } from '@/types/user.types.js';
import { Prisma } from '@prisma/client';

export interface CommentParams extends UserId, CommentId {}

export interface UpdateDTO extends CommentId {
  patchData: Prisma.ProductCommentUpdateInput;
}

export interface PatchCommentDTO extends CommentParams {
  content: string;
}
