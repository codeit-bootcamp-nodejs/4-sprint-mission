import type { ParentContentType, UserId } from './shared.type.js';

export interface CommentId {
  commentId: number;
}

export interface CommentParams extends UserId, CommentId {}

export interface GetCommentList {
  cursorId?: number;
  pageSize: number;
  parentType: ParentContentType;
}

export interface PostComment extends UserId {
  parentId: number;
  parentType: ParentContentType;
  content: string;
}

export interface PatchComment extends CommentId, UserId {
  content: string;
}
