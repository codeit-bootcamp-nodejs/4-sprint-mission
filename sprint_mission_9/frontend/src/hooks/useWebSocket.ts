import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedUser?: {
    nickname: string;
  };
}

export const useWebSocket = (userId: number | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:9999';
    const socketInstance = io(WS_URL);

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);

      const token = localStorage.getItem('accessToken');
      socketInstance.emit('authenticate', { userId, token });
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socketInstance.on('new_notification', (data: { notification: Notification }) => {
      setNotifications((prev) => [data.notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socketInstance.on('notifications_list', (data: { notifications: Notification[] }) => {
      setNotifications(data.notifications);
    });

    socketInstance.on('unread_count', (data: { count: number }) => {
      setUnreadCount(data.count);
    });

    socketInstance.on('marked_read', (data: { notificationId: number }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === data.notificationId ? { ...n, isRead: true } : n))
      );
    });

    socketInstance.on('all_marked_read', () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    });

    socketInstance.on('error', (data: { message: string }) => {
      console.error('WebSocket error:', data.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  const getNotifications = useCallback(() => {
    if (socket) {
      socket.emit('get_notifications', { limit: 20, offset: 0 });
    }
  }, [socket]);

  const markAsRead = useCallback(
    (notificationId: number) => {
      if (socket) {
        socket.emit('mark_read', notificationId);
      }
    },
    [socket]
  );

  const markAllAsRead = useCallback(() => {
    if (socket) {
      socket.emit('mark_all_read');
    }
  }, [socket]);

  return {
    connected,
    notifications,
    unreadCount,
    getNotifications,
    markAsRead,
    markAllAsRead,
  };
};
