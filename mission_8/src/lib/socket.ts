import { Server } from 'socket.io';

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In a real application, restrict this to your frontend's URL
      methods: ['GET', 'POST'],
    },
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
