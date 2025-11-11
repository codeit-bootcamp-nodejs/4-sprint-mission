import http from 'http';
import { socketServer } from '@/lib/socket.js';
import { app } from '@/app.js';

const httpServer = http.createServer(app);

socketServer(httpServer);

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
