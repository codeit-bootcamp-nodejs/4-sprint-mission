// 실시간 알림 기능의 “뼈대” (Socket.IO 서버 설정)
import { Server } from "socket.io";

let io: Server;

export async function initSocket(httpServer: any) {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("✅ 클라이언트 연결됨:", socket.id);

    socket.on("join", async (userId: number) => {
      socket.join(`user-${userId}`);
      console.log(`👤 ${userId}번 유저 방 입장`);
    });

    socket.on("disconnect", async () => {
      console.log("❌ 연결 종료:", socket.id);
    });
  });

  return io;
}

export async function getIO() {
  if (!io) throw new Error("❌ Socket.io가 초기화되지 않았습니다.");
  return io;
}
