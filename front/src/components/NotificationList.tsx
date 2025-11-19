import { useState, useEffect } from 'react';
import { notificationApi } from '../services/api';

export default function NotificationList() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationApi.list();
      setNotifications(response.data || []);
    } catch (err: any) {
      setError(err.message || '알림 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err: any) {
      console.error('미읽음 알림 개수 조회 실패:', err);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId);
      loadNotifications();
      loadUnreadCount();
    } catch (err: any) {
      alert(err.message || '읽음 처리에 실패했습니다.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      loadNotifications();
      loadUnreadCount();
    } catch (err: any) {
      alert(err.message || '전체 읽음 처리에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', color: '#1A237E', margin: 0 }}>
            🔔 알림 목록 {unreadCount > 0 && <span style={{ fontSize: '20px', color: '#FFB74D', fontWeight: '600' }}>({unreadCount}개 미읽음)</span>}
          </h1>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}>
              모두 읽음 처리
            </button>
          )}
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>알림이 없습니다.</p>
          </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="card"
              style={{
                background: notification.isRead ? 'rgba(255, 255, 255, 0.95)' : 'rgba(239, 246, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: notification.isRead ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #4A90E2',
                borderLeft: notification.isRead ? '1px solid rgba(255, 255, 255, 0.2)' : '4px solid #4A90E2',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: notification.isRead ? '500' : '700', fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                    {notification.message}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString('ko-KR') : ''}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="btn btn-success"
                    style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                  >
                    읽음
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}