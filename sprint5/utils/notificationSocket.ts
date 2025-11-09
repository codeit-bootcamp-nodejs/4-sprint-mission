import { Server } from "socket.io";

interface NotificationPayload {
  type: "PRICE_CHANGE" | "COMMENT";
  message: string;
  productId?: number;
  targetId?: number;
}

// 🔹 사용자별 socketId를 저장하는 맵
const userSocketMap = new Map<number, string>();

let io: Server;

// 🔸 Socket.IO 초기화 함수
export const initNotificationSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 클라이언트 연결됨:", socket.id);

    // 클라이언트에서 userId를 보내면 socketId 저장
    socket.on("register", (userId: number) => {
      userSocketMap.set(userId, socket.id);
      console.log(`✅ User ${userId} connected with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

// 🔹 특정 유저에게 알림 전송
export const emitToUser = (userId: number, payload: NotificationPayload) => {
  const socketId = userSocketMap.get(userId);
  if (!socketId) {
    console.log(`⚠️ User ${userId} is offline. Skipping realtime send.`);
    return;
  }
  io.to(socketId).emit("notification", payload);
  console.log(`📨 Sent notification to user ${userId}`);
};
