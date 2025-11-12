import express from 'express';
import cors from 'cors';
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const app = express();
const PORT = process.env.PORT || 3001;

const server = createServer(app);

interface ServerToClientEvents {
  notification: (data: {
    message: string;
    articleId?: number;
    productId?: number;
    createdAt: Date;
  }) => void;
}

const io = new Server<ServerToClientEvents>(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
  }
});

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error("unauthorized"));
  }
  socket.data.userId = userId;
  next();
});


io.on('connection', (socket: Socket<ServerToClientEvents>) => {
  console.log('User is connected');

  socket.join(socket.data.userId);

  socket.on('disconnect', () => {
    console.log('User is disconnected');
  });
});

export { io, server, app };