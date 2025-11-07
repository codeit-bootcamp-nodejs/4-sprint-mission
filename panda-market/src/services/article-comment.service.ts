import { ForbiddenError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { CommentParams, PatchCommentDTO } from '@/dto/base-comments.dto.js';
import { ArticleCommentRepository } from '@/repositories/article-comments.repository.js';
import { PostCommentDTO } from '@/dto/article-comments.dto.js';
import { GetCommentListParams } from '@/dto/article-comments.dto.js';
import { Server } from 'socket.io';
import { NotificationRepository } from '@/repositories/notification.repository.js';
import { ArticleRepository } from '@/repositories/articles.repository.js';
import { Notification, NotifyType, PrismaClient } from '@prisma/client';

@injectable()
export class ArticleCommentService {
  constructor(
    @inject(TYPES.ArticleCommentRepository)
    private readonly articleCommentRepository: ArticleCommentRepository,
    @inject(TYPES.NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    @inject(TYPES.SocketIO)
    private readonly io: Server,
    @inject(TYPES.ArticleRepository)
    private readonly articleRepository: ArticleRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
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
    const { userId: authorId } = await this.articleRepository.findOwnerById({
      articleId,
    });
    let newNotification: Notification | null = null;
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
    const comment = await this.prisma.$transaction(async (tx) => {
      const createdComment = await this.articleCommentRepository.create({
        tx,
        createData,
      });
      if (userId !== authorId) {
        const createData = {
          recipient: {
            connect: {
              id: authorId,
            },
          },
          sender: {
            connect: {
              id: userId,
            },
          },
          type: NotifyType.NEW_COMMENT_PRODUCT,
          targetId: articleId,
        };
        newNotification = await this.notificationRepository.create({
          tx,
          createData,
        });
      }
      return createdComment;
    });
    if (newNotification) {
      const authorRoom = `user_${authorId}`;
      this.io.to(authorRoom).emit('new_notification', newNotification);
    }
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
