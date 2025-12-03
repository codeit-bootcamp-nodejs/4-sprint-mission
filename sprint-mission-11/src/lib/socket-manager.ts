import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import TOKEN from "./constants/jwt.tokens.js";
import prisma from "./prisma.js";
import type { NOTIFTICATION_TYPE } from "@prisma/client";
import { fa } from "zod/locales";

const userSocketMap = new Map();
let io: Server;

export function initialize(_io: Server) {
  io = _io;
  io.on("connection", (socket) => {
    const token = socket.handshake.query.token || socket.handshake.auth.token;

    const userId = verifyJwtToken(token);

    if (!userId) {
      console.error("유효하지 않은 JWT");
      socket.disconnect(true);
      return;
    }

    userSocketMap.set(userId, socket.id);

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
    });
  });
}

async function createNotification(id: Number, type: NOTIFTICATION_TYPE) {
  return await prisma.notification.create({
    data: {
      owner: { connect: { id: Number(id) } },
      type: type,
      isRead: false,
    },
  });
}

export async function sendNotificationToUser(
  userId: string,
  text: string,
  type: NOTIFTICATION_TYPE
) {
  const socketId = userSocketMap.get(userId);

  if (socketId) {
    // 맵에 ID가 있으면 온라인, 해당 소켓으로 전송
    io.to(socketId).emit("newNotification", text);
    console.log(`[PUSH] Notification sent to ${userId} (Online).`);

    createNotification(Number(userId), type);
    return true;
  }

  // 오프라인이므로 DB에만 저장하고 나중에 전달
  console.log(`[STORE] Notification saved for ${userId} (Offline).`);
  return false;
}

export async function sendAdHocGroupNotification(
  userIds: Number[],
  text: string
) {
  if (!io) {
    console.error("Socket.IO not initialized.");
    return;
  }

  // 1. 고유한 임시 Room 이름 생성 (중복 방지를 위해 timestamp와 랜덤 문자열 사용)
  const roomName = `adhoc-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  const activeSockets: any[] = [];

  // 2. Room 가입 (Join)
  for (const userId of userIds) {
    const socketId = userSocketMap.get(userId);

    if (socketId) {
      // socketId를 이용해 실제 소켓 객체를 가져옵니다.
      const socket = io.sockets.sockets.get(socketId);

      if (socket) {
        // 해당 소켓을 임시 Room에 가입시킵니다.
        socket.join(roomName);
        activeSockets.push(socket);
      }
    }
  }

  const recipientCount = activeSockets.length;

  if (recipientCount === 0) {
    console.log("No active users found for ad-hoc notification.");
    return 0;
  }

  // 3. Room으로 알림 브로드캐스팅
  io.to(roomName).emit("groupNotification", text);
  console.log(
    `[AD-HOC PUSH] Sent to ${recipientCount} users in room: ${roomName}`
  );

  // 4. Room 해제 (Leave)
  // 알림 전송 즉시, 해당 소켓들을 Room에서 나가게 합니다.
  for (const socket of activeSockets) {
    socket.leave(roomName);
  }

  const dbCreationPromises = userIds.map((userId) =>
    createNotification(userId, "PROUDCT_PRICE_CHANGE")
  );

  try {
    await Promise.all(dbCreationPromises);
  } catch (error) {
    console.error(error);
  }

  return recipientCount;
}

function verifyJwtToken(token: string) {
  if (!token) {
    return null;
  }
  try {
    //Bearer 제거
    const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    const payload = jwt.verify(pureToken, TOKEN.JWT_ACCESS_TOKEN_SECRET) as {
      id: string;
    };

    return payload.id;
  } catch (err) {
    console.error("JWT 에러 : " + err);
    return null;
  }
}
