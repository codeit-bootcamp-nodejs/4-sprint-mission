// src/server.ts
//HTTP + Socket.IO 서버 실행

import http from "http";
import app from "./app";
import { initSocket } from "./socket/socket";

const server = http.createServer(app);
initSocket(server); // ✅ Socket.IO 초기화

server.listen(4000, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
