// handlers/price-update-notification.handler.ts
import { Server } from 'socket.io';

import { NotificationTypeEnum } from '../../../generated/prisma/enums.js';
import type { EventHandler } from '../../utils/event-bus.js';
import { notificationRepository } from '../notification/notification.repository.js';
import type { PriceUpdateEvent } from '../product/product.js';
import { voteRepository } from '../vote/vote.repository.js';

export class PriceUpdateNotificationHandler implements EventHandler<PriceUpdateEvent> {
  constructor(private io: Server) {}

  async handle(event: PriceUpdateEvent): Promise<void> {
    const votes = await voteRepository.findByProductId(event.productId);
    const userIds = votes.map((vote) => vote.userId);

    if (userIds.length === 0) {
      return;
    }

    const message = `가격이 변경되었습니다: ${event.oldPrice}원 → ${event.newPrice}원`;

    userIds.forEach((userId) => {
      this.io.to(`user:${userId}`).emit('notification', {
        type: 'PRICE_UPDATED',
        productId: event.productId,
        message,
        timestamp: event.updatedAt,
      });
    });

    await Promise.all(
      userIds.map((userId) =>
        notificationRepository.create({
          userId,
          type: NotificationTypeEnum.PRODUCT_PRICE_CHANGED,
          productId: event.productId,
          message,
        }),
      ),
    );
  }
}
