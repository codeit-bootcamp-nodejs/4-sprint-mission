import { Server } from 'socket.io';
import { socketAuth } from '@/middlewares/authentication.js';
import { Server as HttpServer } from 'http';

const io = new Server({
  cors: {
    origin: ['http://localhost:3001'], // 프론트 주소
    methods: ['GET', 'POST'],
  },
});

export function socketServer(httpServer: HttpServer) {
  io.attach(httpServer);

  io.use(socketAuth());

  io.on('connection', (socket) => {
    console.log(`클라이언트가 접속했습니다. id: ${socket.id}`);

    const userId = socket.data.userId;
    console.log('유저 인증 성공');
    console.log(`유저 ID: ${userId}, Socket ID: ${socket.id}`);

    const userRoom = `user_${userId}`;
    socket.join(userRoom);
    console.log(`유저 ${userId} 접속 완료 userRoom: ${userRoom}`);

    socket.on('disconnect', () => {
      console.log(`클라이언트가 접속해제했습니다. id: ${socket.id}`);
    });
  });
}

export { io };
