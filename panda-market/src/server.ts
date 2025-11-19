import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { socketServer } from '@/lib/socket.js';
import { app } from '@/app.js';
import { connectToRedis } from '@/lib/redis.js';

const httpServer = http.createServer(app);

socketServer(httpServer);

const PORT = 3000;
httpServer.listen(PORT, async () => {
  await connectToRedis();
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
