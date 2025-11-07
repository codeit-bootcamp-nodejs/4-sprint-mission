import { inject, injectable } from 'inversify';
import { NotificationRepository } from '@/repositories/notification.repository.js';
import { TYPES } from '@/types/layer.types.js';
import { RecipientId, UpdateReadParams } from '@/dto/notifications.dto.js';

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}
  async getNotifications({ recipientId }: RecipientId) {
    const notifications = this.notificationRepository.findManyUserId({
      recipientId,
    });
    return notifications;
  }
  async getUnreadNotifications({ recipientId }: RecipientId) {
    const notifications = this.notificationRepository.countUnread({
      recipientId,
    });
    return notifications;
  }
  async updateNotifications({ recipientId, notificationId }: UpdateReadParams) {
    const notifications = this.notificationRepository.updateRead({
      recipientId,
      notificationId,
    });
    return notifications;
  }
}
