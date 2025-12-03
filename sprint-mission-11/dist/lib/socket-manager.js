"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = initialize;
exports.sendNotificationToUser = sendNotificationToUser;
exports.sendAdHocGroupNotification = sendAdHocGroupNotification;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_tokens_js_1 = __importDefault(require("./constants/jwt.tokens.js"));
const prisma_js_1 = __importDefault(require("./prisma.js"));
const userSocketMap = new Map();
let io;
function initialize(_io) {
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
async function createNotification(id, type) {
    return await prisma_js_1.default.notification.create({
        data: {
            owner: { connect: { id: Number(id) } },
            type: type,
            isRead: false,
        },
    });
}
async function sendNotificationToUser(userId, text, type) {
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
async function sendAdHocGroupNotification(userIds, text) {
    if (!io) {
        console.error("Socket.IO not initialized.");
        return;
    }
    // 1. 고유한 임시 Room 이름 생성 (중복 방지를 위해 timestamp와 랜덤 문자열 사용)
    const roomName = `adhoc-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
    const activeSockets = [];
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
    console.log(`[AD-HOC PUSH] Sent to ${recipientCount} users in room: ${roomName}`);
    // 4. Room 해제 (Leave)
    // 알림 전송 즉시, 해당 소켓들을 Room에서 나가게 합니다.
    for (const socket of activeSockets) {
        socket.leave(roomName);
    }
    const dbCreationPromises = userIds.map((userId) => createNotification(userId, "PROUDCT_PRICE_CHANGE"));
    try {
        await Promise.all(dbCreationPromises);
    }
    catch (error) {
        console.error(error);
    }
    return recipientCount;
}
function verifyJwtToken(token) {
    if (!token) {
        return null;
    }
    try {
        //Bearer 제거
        const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;
        const payload = jsonwebtoken_1.default.verify(pureToken, jwt_tokens_js_1.default.JWT_ACCESS_TOKEN_SECRET);
        return payload.id;
    }
    catch (err) {
        console.error("JWT 에러 : " + err);
        return null;
    }
}
//# sourceMappingURL=socket-manager.js.map