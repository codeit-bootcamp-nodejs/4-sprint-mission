import { NotificationsRepository } from '../../src/features/notifications/notifications.repository';
import { Pool, QueryResult } from 'pg';
import { CreateNotificationDto } from '../../src/features/notifications/notifications.types';

const mockPool = {
  query: jest.fn(),
} as unknown as Pool;

describe('NotificationsRepository', () => {
  let repository: NotificationsRepository;

  beforeEach(() => {
    repository = new NotificationsRepository(mockPool);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification with product_id', async () => {
      const createDto: CreateNotificationDto = {
        user_id: 1,
        type: 'comment',
        title: 'New Comment',
        message: 'Someone commented on your product',
        product_id: 5,
      };

      const mockNotification = {
        id: 1,
        ...createDto,
        post_id: null,
        is_read: false,
        read_at: null,
        created_at: new Date(),
      };

      const mockQueryResult: QueryResult = {
        rows: [mockNotification],
        command: 'INSERT',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      const result = await repository.create(createDto);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO notifications'),
        [
          createDto.user_id,
          createDto.type,
          createDto.title,
          createDto.message,
          createDto.product_id,
          createDto.post_id,
        ]
      );
      expect(result).toEqual(mockNotification);
    });

    it('should create a notification with post_id', async () => {
      const createDto: CreateNotificationDto = {
        user_id: 2,
        type: 'like',
        title: 'New Like',
        message: 'Someone liked your article',
        post_id: 10,
      };

      const mockNotification = {
        id: 2,
        ...createDto,
        product_id: null,
        is_read: false,
        read_at: null,
        created_at: new Date(),
      };

      const mockQueryResult: QueryResult = {
        rows: [mockNotification],
        command: 'INSERT',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      const result = await repository.create(createDto);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO notifications'),
        [
          createDto.user_id,
          createDto.type,
          createDto.title,
          createDto.message,
          createDto.product_id,
          createDto.post_id,
        ]
      );
      expect(result).toEqual(mockNotification);
    });

    it('should create notification without product_id or post_id', async () => {
      const createDto: CreateNotificationDto = {
        user_id: 3,
        type: 'system',
        title: 'System Alert',
        message: 'System maintenance scheduled',
      };

      const mockNotification = {
        id: 3,
        ...createDto,
        product_id: null,
        post_id: null,
        is_read: false,
        read_at: null,
        created_at: new Date(),
      };

      const mockQueryResult: QueryResult = {
        rows: [mockNotification],
        command: 'INSERT',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      await repository.create(createDto);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.any(String),
        [
          createDto.user_id,
          createDto.type,
          createDto.title,
          createDto.message,
          undefined,
          undefined,
        ]
      );
    });
  });

  describe('findByUserId', () => {
    it('should find notifications by user id with default limit', async () => {
      const userId = 1;
      const mockNotifications = [
        {
          id: 1,
          user_id: userId,
          type: 'comment',
          title: 'Test',
          message: 'Test',
          is_read: false,
          created_at: new Date(),
        },
        {
          id: 2,
          user_id: userId,
          type: 'like',
          title: 'Test2',
          message: 'Test2',
          is_read: true,
          read_at: new Date(),
          created_at: new Date(),
        },
      ];

      const mockQueryResult: QueryResult = {
        rows: mockNotifications,
        command: 'SELECT',
        oid: 0,
        rowCount: 2,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      const result = await repository.findByUserId(userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM notifications'),
        [userId, 20]
      );
      expect(result).toEqual(mockNotifications);
    });

    it('should find notifications with custom limit', async () => {
      const userId = 2;
      const limit = 10;
      const mockNotifications: unknown[] = [];

      const mockQueryResult: QueryResult = {
        rows: mockNotifications,
        command: 'SELECT',
        oid: 0,
        rowCount: 0,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      const result = await repository.findByUserId(userId, limit);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        [userId, limit]
      );
      expect(result).toEqual(mockNotifications);
    });

    it('should order by created_at DESC', async () => {
      const userId = 1;

      const mockQueryResult: QueryResult = {
        rows: [],
        command: 'SELECT',
        oid: 0,
        rowCount: 0,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      await repository.findByUserId(userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        expect.any(Array)
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      const userId = 1;
      const unreadCount = 5;

      const mockQueryResult: QueryResult = {
        rows: [{ unread_count: unreadCount.toString() }],
        command: 'SELECT',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      const result = await repository.getUnreadCount(userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) AS unread_count'),
        [userId]
      );
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('is_read = FALSE'),
        [userId]
      );
      expect(result).toBe(unreadCount);
    });

    it('should return 0 when no unread notifications', async () => {
      const userId = 2;

      const mockQueryResult: QueryResult = {
        rows: [{ unread_count: '0' }],
        command: 'SELECT',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      const result = await repository.getUnreadCount(userId);

      expect(result).toBe(0);
    });

    it('should parse string count to number', async () => {
      const userId = 3;

      const mockQueryResult: QueryResult = {
        rows: [{ unread_count: '15' }],
        command: 'SELECT',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      const result = await repository.getUnreadCount(userId);

      expect(typeof result).toBe('number');
      expect(result).toBe(15);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 1;

      const mockQueryResult: QueryResult = {
        rows: [],
        command: 'UPDATE',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      await repository.markAsRead(notificationId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE notifications'),
        [notificationId]
      );
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SET is_read = TRUE'),
        [notificationId]
      );
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('read_at = NOW()'),
        [notificationId]
      );
    });

    it('should update correct notification by id', async () => {
      const notificationId = 5;

      const mockQueryResult: QueryResult = {
        rows: [],
        command: 'UPDATE',
        oid: 0,
        rowCount: 1,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      await repository.markAsRead(notificationId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id = $1'),
        [notificationId]
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all user notifications as read', async () => {
      const userId = 1;

      const mockQueryResult: QueryResult = {
        rows: [],
        command: 'UPDATE',
        oid: 0,
        rowCount: 3,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      await repository.markAllAsRead(userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE notifications'),
        [userId]
      );
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SET is_read = TRUE'),
        [userId]
      );
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1 AND is_read = FALSE'),
        [userId]
      );
    });

    it('should only update unread notifications', async () => {
      const userId = 2;

      const mockQueryResult: QueryResult = {
        rows: [],
        command: 'UPDATE',
        oid: 0,
        rowCount: 0,
        fields: [],
      };

      (mockPool.query as jest.Mock).mockResolvedValue(mockQueryResult);

      await repository.markAllAsRead(userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('is_read = FALSE'),
        [userId]
      );
    });
  });
});
