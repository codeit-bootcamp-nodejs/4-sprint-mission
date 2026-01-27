import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { prisma } from "../prisma/client.js";

export const setupSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join", (userId: number) => {
      if (!userId) return;
      socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  const sendNotification = async (userId: number, message: string, type: string) => {
    try {
      const notification = await prisma.notification.create({
        data: { userId, message, type },
      });
      io.to(`user_${userId}`).emit("notification", notification);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  return { io, sendNotification };
};
