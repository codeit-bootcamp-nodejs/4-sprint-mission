import { Server } from "socket.io";

export function registerSocket(io: Server) {
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("register", (userId: number) => {
            socket.join(`user:${userId}`);
            console.log(`User ${userId} joined room user:${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}