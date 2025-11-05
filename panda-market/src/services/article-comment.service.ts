import { ForbiddenError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { CommentParams, PatchCommentDTO } from '@/dto/base-comments.dto.js';
import { ArticleCommentRepository } from '@/repositories/article-comments.repository.js';
import { PostCommentDTO } from '@/dto/article-comments.dto.js';
import { GetCommentListParams } from '@/dto/article-comments.dto.js';

@injectable()
export class ArticleCommentService {
  constructor(
    @inject(TYPES.ArticleCommentRepository)
    private readonly articleCommentRepository: ArticleCommentRepository,
  ) {}

  async authorization({ userId, commentId }: CommentParams): Promise<boolean> {
    const comment = await this.articleCommentRepository.findOwnerById({
      commentId,
    });
    return comment.userId === userId;
  }

  async getCommentList({
    cursorId,
    articleId,
    pageSize,
  }: GetCommentListParams) {
    const comment = await this.articleCommentRepository.findMany({
      cursorId,
      articleId,
      pageSize,
    });
    return comment;
  }

  async postComment({ userId, articleId, content }: PostCommentDTO) {
    const createData = {
      user: {
        connect: {
          id: userId,
        },
      },
      article: {
        connect: {
          id: articleId,
        },
      },
      content,
    };
    const comment = await this.articleCommentRepository.create(createData);
    return comment;
  }

  async patchComment({ commentId, userId, content }: PatchCommentDTO) {
    if (await this.authorization({ userId, commentId })) {
      const patchData = {
        content,
      };
      const comment = await this.articleCommentRepository.update({
        commentId,
        patchData,
      });
      return comment;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    if (await this.authorization({ userId, commentId })) {
      const comment = await this.articleCommentRepository.delete({ commentId });
      return comment;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
}
