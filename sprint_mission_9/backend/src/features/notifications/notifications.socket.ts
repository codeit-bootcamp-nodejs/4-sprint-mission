import { Server as SocketIOServer, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

interface GetNotificationsPayload {
  limit?: number;
  offset?: number;
}

export class NotificationsSocket {
  constructor(
    private io: SocketIOServer,
    private service: NotificationsService
  ) {
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      // Removed console.log for production

      socket.on('authenticate', async (data: { userId: number; token: string }) => {
        await this.handleAuthenticate(socket, data);
      });

      socket.on('get_notifications', async (payload: GetNotificationsPayload) => {
        await this.handleGetNotifications(socket, payload);
      });

      socket.on('mark_read', async (notificationId: number) => {
        await this.handleMarkRead(socket, notificationId);
      });

      socket.on('mark_all_read', async () => {
        await this.handleMarkAllRead(socket);
      });

      socket.on('disconnect', () => {
        // Cleanup on disconnect
        if (socket.userId) {
          socket.leave(`user-${socket.userId}`);
        }
      });
    });
  }

  private async handleAuthenticate(
    socket: AuthenticatedSocket,
    data: { userId: number; token: string }
  ) {
    try {
      const { userId, token } = data;

      // Validate input
      if (!userId || typeof userId !== 'number' || userId <= 0) {
        socket.emit('error', { message: 'Invalid userId' });
        return;
      }

      if (!token || typeof token !== 'string') {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }

      // TODO: Verify JWT token here
      // For now, using mock token validation
      if (token !== 'mock-jwt-token') {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }

      socket.join(`user-${userId}`);
      socket.userId = userId;

      const count = await this.service.getUnreadCount(userId);
      socket.emit('unread_count', { count });
    } catch (error: any) {
      socket.emit('error', { message: error.message || 'Authentication failed' });
    }
  }

  private async handleGetNotifications(
    socket: AuthenticatedSocket,
    payload: GetNotificationsPayload
  ) {
    try {
      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      const limit = payload?.limit && payload.limit > 0 ? payload.limit : 20;
      const offset = payload?.offset && payload.offset >= 0 ? payload.offset : 0;

      const notifications = await this.service.getUserNotifications(
        socket.userId,
        limit
      );
      socket.emit('notifications_list', { notifications });
    } catch (error: any) {
      socket.emit('error', { message: error.message || 'Failed to get notifications' });
    }
  }

  private async handleMarkRead(socket: AuthenticatedSocket, notificationId: number) {
    try {
      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Validate notificationId
      if (!notificationId || typeof notificationId !== 'number' || notificationId <= 0) {
        socket.emit('error', { message: 'Invalid notificationId' });
        return;
      }

      // TODO: Verify ownership of notification
      await this.service.markAsRead(notificationId);

      // Get updated unread count
      const count = await this.service.getUnreadCount(socket.userId);

      socket.emit('marked_read', { notificationId });
      socket.emit('unread_count', { count });
    } catch (error: any) {
      socket.emit('error', { message: error.message || 'Failed to mark as read' });
    }
  }

  private async handleMarkAllRead(socket: AuthenticatedSocket) {
    try {
      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      await this.service.markAllAsRead(socket.userId);

      socket.emit('all_marked_read');
      socket.emit('unread_count', { count: 0 });
    } catch (error: any) {
      socket.emit('error', { message: error.message || 'Failed to mark all as read' });
    }
  }

  // Method to emit new notification to specific user
  emitNotificationToUser(userId: number, notification: any) {
    this.io.to(`user-${userId}`).emit('new_notification', { notification });
  }
}
