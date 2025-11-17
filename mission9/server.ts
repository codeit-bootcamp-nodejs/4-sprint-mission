import http from "http";
import { Server } from "socket.io";
import { NotificationService } from "./service/notification.service.js";
import prisma from "./lib/prisma.js";
import { Socket } from "socket.io";
import type { WebSocket} from "ws";


const server = http.createServer();
const wss = new Server(server);
const notificationService = new NotificationService(prisma, wss as unknown as any);
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = new Map<number, Socket>();
io.on("connection", (socket) => {


  socket.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    ws.online = true; 
})
    socket.on("REGISTER_USER", ({ userId }) => {
        userSocketMap.set(userId, socket);
        console.log(`Registered user ${userId} with socket ${socket.id}`);
    })
 
    socket.on("disconnect", () => {
        for (const [userId, s] of userSocketMap){
            if(s.id === socket.id )userSocketMap.delete(userId)
        }
        console.log(`User disconnected: ${socket.id}`);
    })
});
export const emitToUser = (userId : number, event :string, payload:any )=> {
    const socket = userSocketMap.get(userId);
    if (socket && socket.connected) {
        socket.emit(event, payload);
    }

}
if (process.env.NODE_ENV !== "test") {
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
}
