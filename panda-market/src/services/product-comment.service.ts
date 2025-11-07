import { ForbiddenError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { CommentParams, PatchCommentDTO } from '@/dto/base-comments.dto.js';
import { ProductCommentRepository } from '@/repositories/product-comments.repository.js';
import {
  GetCommentListParams,
  PostCommentDTO,
} from '@/dto/product-comments.dto.js';
import { ProductRepository } from '@/repositories/products.repository.js';
import { Notification, NotifyType, PrismaClient } from '@prisma/client';
import { NotificationRepository } from '@/repositories/notification.repository.js';
import { Server } from 'socket.io';

@injectable()
export class ProductCommentService {
  constructor(
    @inject(TYPES.ProductCommentRepository)
    private readonly productCommentRepository: ProductCommentRepository,
    @inject(TYPES.NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    @inject(TYPES.SocketIO)
    private readonly io: Server,
    @inject(TYPES.ProductRepository)
    private readonly productRepository: ProductRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  async authorization({ userId, commentId }: CommentParams): Promise<boolean> {
    const comment = await this.productCommentRepository.findOwnerById({
      commentId,
    });
    return comment.userId === userId;
  }

  async getCommentList({
    cursorId,
    productId,
    pageSize,
  }: GetCommentListParams) {
    const comment = await this.productCommentRepository.findMany({
      cursorId,
      productId,
      pageSize,
    });
    return comment;
  }

  async postComment({ userId, productId, content }: PostCommentDTO) {
    const { userId: authorId } = await this.productRepository.findOwnerById({
      productId,
    });
    let newNotification: Notification | null = null;

    const createData = {
      user: {
        connect: {
          id: userId,
        },
      },
      product: {
        connect: {
          id: productId,
        },
      },
      content,
    };
    const comment = await this.prisma.$transaction(async (tx) => {
      const createdComment = await this.productCommentRepository.create({
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
          targetId: productId,
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
      const comment = await this.productCommentRepository.update({
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
      const comment = await this.productCommentRepository.delete({ commentId });
      return comment;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
}
