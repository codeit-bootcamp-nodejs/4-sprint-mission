import { NotificationsService } from '../../src/features/notifications/notifications.service';
import { NotificationsRepository } from '../../src/features/notifications/notifications.repository';
import { CreateNotificationDto, Notification } from '../../src/features/notifications/notifications.types';

jest.mock('../../src/features/notifications/notifications.repository');

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockRepository: jest.Mocked<NotificationsRepository>;

  beforeEach(() => {
    mockRepository = new NotificationsRepository(null as any) as jest.Mocked<NotificationsRepository>;
    service = new NotificationsService(mockRepository);
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const createDto: CreateNotificationDto = {
        user_id: 1,
        type: 'comment',
        title: 'New Comment',
        message: 'Someone commented on your product',
        product_id: 5,
      };

      const mockNotification: Notification = {
        id: 1,
        ...createDto,
        is_read: false,
        created_at: new Date(),
      };

      mockRepository.create = jest.fn().mockResolvedValue(mockNotification);

      const result = await service.createNotification(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockNotification);
    });

    it('should create notification with post_id', async () => {
      const createDto: CreateNotificationDto = {
        user_id: 2,
        type: 'like',
        title: 'New Like',
        message: 'Someone liked your article',
        post_id: 10,
      };

      const mockNotification: Notification = {
        id: 2,
        ...createDto,
        is_read: false,
        created_at: new Date(),
      };

      mockRepository.create = jest.fn().mockResolvedValue(mockNotification);

      const result = await service.createNotification(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications with default limit', async () => {
      const userId = 1;
      const mockNotifications: Notification[] = [
        {
          id: 1,
          user_id: userId,
          type: 'comment',
          title: 'New Comment',
          message: 'Test',
          is_read: false,
          created_at: new Date(),
        },
        {
          id: 2,
          user_id: userId,
          type: 'like',
          title: 'New Like',
          message: 'Test2',
          is_read: true,
          read_at: new Date(),
          created_at: new Date(),
        },
      ];

      mockRepository.findByUserId = jest.fn().mockResolvedValue(mockNotifications);

      const result = await service.getUserNotifications(userId);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId, undefined);
      expect(result).toEqual(mockNotifications);
    });

    it('should get user notifications with custom limit', async () => {
      const userId = 2;
      const limit = 10;
      const mockNotifications: Notification[] = [];

      mockRepository.findByUserId = jest.fn().mockResolvedValue(mockNotifications);

      const result = await service.getUserNotifications(userId, limit);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId, limit);
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      const userId = 1;
      const unreadCount = 5;

      mockRepository.getUnreadCount = jest.fn().mockResolvedValue(unreadCount);

      const result = await service.getUnreadCount(userId);

      expect(mockRepository.getUnreadCount).toHaveBeenCalledWith(userId);
      expect(result).toBe(unreadCount);
    });

    it('should return 0 when no unread notifications', async () => {
      const userId = 2;

      mockRepository.getUnreadCount = jest.fn().mockResolvedValue(0);

      const result = await service.getUnreadCount(userId);

      expect(result).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 1;

      mockRepository.markAsRead = jest.fn().mockResolvedValue(undefined);

      await service.markAsRead(notificationId);

      expect(mockRepository.markAsRead).toHaveBeenCalledWith(notificationId);
    });

    it('should not return a value', async () => {
      const notificationId = 5;

      mockRepository.markAsRead = jest.fn().mockResolvedValue(undefined);

      const result = await service.markAsRead(notificationId);

      expect(result).toBeUndefined();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all user notifications as read', async () => {
      const userId = 1;

      mockRepository.markAllAsRead = jest.fn().mockResolvedValue(undefined);

      await service.markAllAsRead(userId);

      expect(mockRepository.markAllAsRead).toHaveBeenCalledWith(userId);
    });

    it('should not return a value', async () => {
      const userId = 3;

      mockRepository.markAllAsRead = jest.fn().mockResolvedValue(undefined);

      const result = await service.markAllAsRead(userId);

      expect(result).toBeUndefined();
    });
  });
});
