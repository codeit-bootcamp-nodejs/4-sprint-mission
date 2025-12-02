"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIo = initIo;
exports.getIo = getIo;
const socket_io_1 = require("socket.io");
let io = null;
function initIo(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });
    return io;
}
function getIo() {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
}
//# sourceMappingURL=io.js.map