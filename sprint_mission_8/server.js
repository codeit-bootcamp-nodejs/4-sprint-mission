require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'panda_market',
  user: process.env.DB_USER || 'panda_user',
  password: process.env.DB_PASSWORD || 'panda1234',
});

io.on('connection', (socket) => {
  console.log('클라이언트 연결됨:', socket.id);

  socket.on('authenticate', async (userId) => {
    socket.join(`user-${userId}`);
    socket.userId = userId;
    console.log(`유저 ${userId} 인증 완료`);

    const result = await pool.query(
      'SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    socket.emit('unread_count', {
      count: parseInt(result.rows[0].unread_count)
    });
  });

  socket.on('get_notifications', async (userId) => {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );
    socket.emit('notifications_list', {
      notifications: result.rows
    });
  });

  socket.on('mark_read', async (notificationId) => {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = $1',
      [notificationId]
    );
    socket.emit('marked_read', { notificationId });
  });

  socket.on('mark_all_read', async (userId) => {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    socket.emit('all_marked_read');
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      console.log(`유저 ${socket.userId} 연결 해제`);
    }
  });
});

async function startListening() {
  const client = await pool.connect();

  await client.query(`
    CREATE OR REPLACE FUNCTION notify_new_notification()
    RETURNS TRIGGER AS $$
    BEGIN
      PERFORM pg_notify(
        'new_notification',
        json_build_object(
          'id', NEW.id,
          'user_id', NEW.user_id,
          'type', NEW.type,
          'title', NEW.title,
          'message', NEW.message,
          'product_id', NEW.product_id,
          'post_id', NEW.post_id,
          'created_at', NEW.created_at
        )::text
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await client.query(`
    DROP TRIGGER IF EXISTS trg_notify_new_notification ON notifications;
    CREATE TRIGGER trg_notify_new_notification
      AFTER INSERT ON notifications
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_notification();
  `);

  await client.query('LISTEN new_notification');

  client.on('notification', (msg) => {
    const notification = JSON.parse(msg.payload);
    io.to(`user-${notification.user_id}`).emit('new_notification', {
      notification: notification
    });
  });

  console.log('PostgreSQL LISTEN 설정 완료');
}

app.use(express.static('public'));
app.use(express.json());

app.post('/api/test-notification', async (req, res) => {
  const { userId, type, title, message } = req.body;

  await pool.query(
    `INSERT INTO notifications (user_id, type, title, message)
     VALUES ($1, $2, $3, $4)`,
    [userId, type, title, message]
  );

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  await startListening();
});
