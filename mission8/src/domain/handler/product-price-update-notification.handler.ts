import { Server } from 'socket.io';

import { NotificationTargetType, NotificationTypeEnum } from '../../../generated/prisma/enums.js';
import type { EventHandler } from '../../utils/event-bus.js';
import { likeRepository } from '../like/like.repository.js';
import { notificationRepository } from '../notification/notification.repository.js';
import type { PriceUpdateEvent } from '../product/product.js';

export class PriceUpdateNotificationHandler implements EventHandler<PriceUpdateEvent> {
  constructor(private io: Server) {}

  async handle(event: PriceUpdateEvent): Promise<void> {
    const likes = await likeRepository.findByProductId(event.productId);
    const userIds = likes.map((like) => like.userId);

    if (userIds.length === 0) {
      return;
    }

    const message = `상품 "${event.name}"의 가격이 변경되었습니다: ${event.oldPrice}원 → ${event.newPrice}원`;

    // 소켓 알림
    const batchSize = 100;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      batch.forEach((userId) => {
        this.io.to(`user:${userId}`).emit('notification', {
          type: 'PRICE_UPDATED',
          productId: event.productId,
          message,
          timestamp: event.updatedAt,
        });
      });

      // 데이터베이스에 알림 저장
      await notificationRepository.createMany({
        userIds: batch,
        type: NotificationTypeEnum.PRODUCT_PRICE_CHANGED,
        targetType: NotificationTargetType.PRODUCT,
        targetId: event.productId,
        message,
      });
    }
  }
}
