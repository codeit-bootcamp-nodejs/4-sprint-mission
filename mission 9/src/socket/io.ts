import { Server } from "socket.io";

let io: Server | null = null;

export function initIo(server: any) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  return io;
}

export function getIo(): Server {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
}
