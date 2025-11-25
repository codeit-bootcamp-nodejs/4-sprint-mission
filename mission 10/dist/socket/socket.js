"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocket = registerSocket;
const io_1 = require("./io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function registerSocket() {
    const io = (0, io_1.getIo)();
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        const token = socket.handshake.auth?.token;
        if (!token)
            return socket.disconnect();
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.join(`user:${decoded.id}`);
        }
        catch (err) {
            socket.disconnect();
        }
    });
}
//# sourceMappingURL=socket.js.map