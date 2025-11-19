let socket;
let currentUserId = null;
const statusEl = document.getElementById('status');
const userSelect = document.getElementById('userSelect');
const notificationList = document.getElementById('notificationList');
const unreadBadge = document.getElementById('unreadBadge');
const markAllReadBtn = document.getElementById('markAllRead');

function connectSocket() {
  socket = io();

  socket.on('connect', () => {
    statusEl.textContent = '연결됨';
    statusEl.classList.add('connected');
    if (currentUserId) {
      socket.emit('authenticate', parseInt(currentUserId));
    }
  });

  socket.on('unread_count', (data) => {
    updateUnreadBadge(data.count);
  });

  socket.on('notifications_list', (data) => {
    renderNotifications(data.notifications);
  });

  socket.on('new_notification', (data) => {
    loadNotifications();
  });

  socket.on('marked_read', () => {
    loadNotifications();
  });

  socket.on('all_marked_read', () => {
    loadNotifications();
  });

  socket.on('disconnect', () => {
    statusEl.textContent = '연결 끊김';
    statusEl.classList.remove('connected');
  });

  socket.on('reconnect', () => {
    statusEl.textContent = '재연결됨';
    statusEl.classList.add('connected');
    if (currentUserId) {
      socket.emit('authenticate', parseInt(currentUserId));
      loadNotifications();
    }
  });
}

userSelect.addEventListener('change', (e) => {
  currentUserId = e.target.value;
  if (currentUserId && socket.connected) {
    socket.emit('authenticate', parseInt(currentUserId));
    loadNotifications();
  } else {
    notificationList.innerHTML = '<div class="empty-state">사용자를 선택하세요</div>';
    updateUnreadBadge(0);
  }
});

markAllReadBtn.addEventListener('click', () => {
  if (currentUserId && socket.connected) {
    socket.emit('mark_all_read', parseInt(currentUserId));
  }
});

function loadNotifications() {
  if (currentUserId && socket.connected) {
    socket.emit('get_notifications', parseInt(currentUserId));
  }
}

function renderNotifications(notifications) {
  if (notifications.length === 0) {
    notificationList.innerHTML = '<div class="empty-state">알림이 없습니다</div>';
    return;
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;
  updateUnreadBadge(unreadCount);

  notificationList.innerHTML = notifications.map(n => `
    <div class="notification-item ${!n.is_read ? 'unread' : ''}" onclick="markAsRead(${n.id})">
      <div class="notification-item-title">${n.title}</div>
      <div class="notification-item-message">${n.message}</div>
      <div class="notification-item-time">${formatTime(n.created_at)}</div>
    </div>
  `).join('');
}

function markAsRead(notificationId) {
  if (socket.connected) {
    socket.emit('mark_read', notificationId);
  }
}

function updateUnreadBadge(count) {
  unreadBadge.textContent = count;
  unreadBadge.style.display = count > 0 ? 'inline-block' : 'none';
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return date.toLocaleDateString('ko-KR');
}

async function sendTestNotification(type) {
  if (!currentUserId) {
    alert('사용자를 선택하세요');
    return;
  }

  const messages = {
    'PRODUCT_PRICE_CHANGE': {
      title: '가격 변경 알림',
      message: 'iPhone 15 Pro 가격이 1,200,000원에서 1,000,000원으로 변경되었습니다.'
    },
    'POST_COMMENT': {
      title: '게시글 댓글 알림',
      message: '판다마켓 사용 후기 게시글에 댓글이 달렸습니다.'
    },
    'PRODUCT_COMMENT': {
      title: '상품 댓글 알림',
      message: 'MacBook Pro 상품에 댓글이 달렸습니다.'
    }
  };

  await fetch('/api/test-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: parseInt(currentUserId),
      type: type,
      ...messages[type]
    })
  });
}

connectSocket();
