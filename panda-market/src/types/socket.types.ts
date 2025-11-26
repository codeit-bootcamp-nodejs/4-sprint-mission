import { Socket } from 'socket.io';

export interface ExtendedError extends Error {
  data?: unknown;
}
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError | Error) => void,
) => void;
