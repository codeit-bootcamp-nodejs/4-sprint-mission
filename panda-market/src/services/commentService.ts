import type {
  CommentParams,
  GetCommentList,
  PatchComment,
  PostComment,
} from '@/types/comment.typs.js';
import type { Prisma } from '@prisma/client';
import { BadRequestError, ForbiddenError } from '@/lib/errors.js';
import type { CommentRepository } from '@/repositories/comments.repository.js';
import type { SingularContentType } from '@/types/shared.type.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class CommentService {
  constructor(
    @inject(TYPES.CommentRepository) private readonly commentRepository: CommentRepository
  ) {}

  async authorization({ userId, commentId }: CommentParams): Promise<boolean> {
    const comment = await this.commentRepository.findOwnerById({ commentId });
    return comment.userId === userId;
  }

  async getCommentList({ cursorId, pageSize, parentType }: GetCommentList) {
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
    const comment = await this.commentRepository.findMany({ query });
    return comment;
  }

  async postComment({ userId, parentId, parentType, content }: PostComment) {
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
    const comment = await this.commentRepository.create({
      userId,
      parentId,
      singularParentType,
      content,
    });
    return comment;
  }

  async patchComment({ commentId, userId, content }: PatchComment) {
    if (await this.authorization({ userId, commentId })) {
      const comment = await this.commentRepository.update({ commentId, content });
      return comment;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    if (await this.authorization({ userId, commentId })) {
      const comment = await this.commentRepository.delete({ commentId });
      return comment;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
}
