//andlers/comment-notification.handler.ts
import { Server } from 'socket.io';

import { NotificationTypeEnum } from '../../../generated/prisma/enums.js';
import type { EventHandler } from '../../utils/event-bus.js';
import type { CommentCreatedEvent } from '../comment/comment.js';
import { notificationRepository } from '../notification/notification.repository.js';
import { productRepository } from '../product/product.repository.js';

export class CommentNotificationHandler implements EventHandler<CommentCreatedEvent> {
  constructor(private io: Server) {}

  async handle(event: CommentCreatedEvent): Promise<void> {
    const product = await productRepository.findById(event.productId);

    if (!product) {
      console.error(`Product not found: ${event.productId}`);
      return;
    }

    if (product.userId === event.userId) {
      return;
    }

    const message = `회원님의 상품에 새 댓글이 달렸습니다: "${event.content.substring(0, 20)}${event.content.length > 20 ? '...' : ''}"`;

    this.io.to(`user:${product.userId}`).emit('notification', {
      type: 'COMMENT_CREATED',
      productId: event.productId,
      commentId: event.commentId,
      message,
      timestamp: event.createdAt,
    });

    await notificationRepository.create({
      userId: product.userId,
      type: NotificationTypeEnum.NEW_COMMENT,
      productId: event.productId,
      message,
    });
  }
}
