import { getIo } from "./io";
import jwt from "jsonwebtoken";

export function registerSocket() {
  const io = getIo();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
      };

      socket.join(`user:${decoded.id}`);
    } catch (err) {
      socket.disconnect();
    }
  });
}
