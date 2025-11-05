//src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setSocketIoInstance } from './services/notification_service';

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

setSocketIoInstance(io);

io.on('connection', (socket) => {
    console.log(`[Socket.IO] 클라이언트 연결 성공: ${socket.id}`);

    socket.on('register', (userId: string | number) => {
        if (!userId) {
            console.warn(`[Socket.IO] 비정상적인 register 이벤트 (userId 없음)`);
            return;
        }

        const userRoom = String(userId);

        console.log(`[Socket.IO] 유저 등록: ${userRoom} 방에 참가`);
        socket.join(userRoom);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.IO] 클라이언트 연결 종료: ${socket.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`[HTTP Server] http://localhost:${PORT} 에서 실행 중`);
    console.log(`[Socket.IO] 실시간 알림 서버가 대기 중입니다.`);
});