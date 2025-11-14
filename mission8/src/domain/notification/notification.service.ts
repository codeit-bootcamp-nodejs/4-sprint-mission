import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import { notificationRepository } from './notification.repository.js';
import type { GetListInput } from './notification.type.js';

class NotificationService {
  list = async (getListInput: GetListInput) => {
    return await notificationRepository.list(getListInput);
  };

  read = async (notificationIds: number[], userId: number) => {
    const result = await notificationRepository.read(notificationIds, userId);
    if (result.count === 0) {
      throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.notificationNotFound);
    }
    return { status: STATUS_CODE.CREATED, message: `${result.count}개의 알림이 읽음 처리 되었습니다` };
  };

  unreadCount = async (userId: number) => {
    return await notificationRepository.unreadCount(userId);
  };
}

export const notificationService = new NotificationService();
