import type {
  CommentParams,
  GetCommentList,
  PatchComment,
  PostComment,
} from '@/types/comment.typs.js';
import type { Prisma } from '@prisma/client';
import { BadRequestError, ForbiddenError } from '@/lib/errors.js';
import CommentRepository from '@/repositories/comments.repository.js';
import type { SingularContentType } from '@/types/shared.type.js';

async function authorization({ userId, commentId }: CommentParams): Promise<boolean> {
  const comment = await CommentRepository.findOwnerById({ commentId });
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
  const comment = await CommentRepository.findMany({ query });
  return comment;
}

async function postCommentService({ userId, parentId, parentType, content }: PostComment) {
  let singularParentType: SingularContentType;
  switch (parentType) {
    case 'products':
      singularParentType = 'product';
      break;
    case 'articles':
      singularParentType = 'article';
      break;
    default:
      throw new BadRequestError();
  }
  const comment = await CommentRepository.create({ userId, parentId, singularParentType, content });
  return comment;
}

async function patchCommentService({ commentId, userId, content }: PatchComment) {
  if (await authorization({ userId, commentId })) {
    const comment = await CommentRepository.update({ commentId, content });
    return comment;
  } else {
    throw new ForbiddenError('수정 권한이 없습니다.');
  }
}

async function deleteCommentService({ commentId, userId }: CommentParams) {
  if (await authorization({ userId, commentId })) {
    const comment = await CommentRepository.delete({ commentId });
    return comment;
  } else {
    throw new ForbiddenError('삭제 권한이 없습니다.');
  }
}

export { getCommentListService, postCommentService, patchCommentService, deleteCommentService };
