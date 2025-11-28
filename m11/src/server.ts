import 'dotenv/config';

import app from './app.js';
import { PORT } from './config/constants.js';
import { createServer } from 'http';
import { initSocketIO } from './config/socket.js';

// HTTP 서버 생성
const httpServer = createServer(app);

// Socket.IO 초기화
initSocketIO(httpServer);

// 서버 시작
httpServer.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
    console.log(`✅ Socket.IO is ready`);
});
