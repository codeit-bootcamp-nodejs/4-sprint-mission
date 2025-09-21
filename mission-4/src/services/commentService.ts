import type {
  CommentParams,
  GetCommentList,
  PatchComment,
  PostComment,
} from '@/types/comment.typs.js';
import prisma from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';
import { ForbiddenError } from '@/lib/errors.js';

async function authorization({ userId, commentId }: CommentParams): Promise<boolean> {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
  });
  return comment.userId === userId;
}

async function getCommentListService({ cursorId, pageSize, parentType }: GetCommentList) {
  const where =
    parentType === 'products' ? { productId: { not: null } } : { articleId: { not: null } };
  const query: Prisma.CommentFindManyArgs = {
    where,
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
    take: pageSize,
  };
  if (cursorId) {
    query['cursor'] = { id: cursorId };
    query['skip'] = 1;
  }
  const comment = await prisma.comment.findMany(query);
  return comment;
}

async function postCommentService({ userId, parentId, parentType, content }: PostComment) {
  const singularParentType = parentType.endsWith('s') ? parentType.slice(0, -1) : parentType;
  const comment = await prisma.comment.create({
    data: {
      content,
      [`${singularParentType}Id`]: parentId,
      userId,
    },
    include: {
      [singularParentType]: true,
    },
  });
  return comment;
}

async function patchCommentService({ commentId, userId, content }: PatchComment) {
  if (await authorization({ userId, commentId })) {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
    });
    return comment;
  } else {
    throw new ForbiddenError('수정 권한이 없습니다.');
  }
}

async function deleteCommentService({ commentId, userId }: CommentParams) {
  if (await authorization({ userId, commentId })) {
    const comment = await prisma.comment.delete({
      where: { id: commentId },
    });
    return comment;
  } else {
    throw new ForbiddenError('삭제 권한이 없습니다.');
  }
}

export { getCommentListService, postCommentService, patchCommentService, deleteCommentService };
