import { notificationRepository } from './notification.repository.js';

class NotificationService {
  list = async (userId: number) => {
    return notificationRepository.list(userId);
  };

  read = async (notificationIds: number[]) => {
    return notificationRepository.read(notificationIds);
  };

  unreadCount = async () => {
    return notificationRepository.unreadCount();
  };
}

export const notificationService = new NotificationService();
