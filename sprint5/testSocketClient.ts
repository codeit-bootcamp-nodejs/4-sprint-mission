import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const userId = 1; // 테스트할 유저 ID

socket.on("connect", () => {
  console.log("✅ 서버 연결됨:", socket.id);
  socket.emit("register", userId);
});

socket.on("notification", (data) => {
  console.log("📢 새 알림:", data);
});
