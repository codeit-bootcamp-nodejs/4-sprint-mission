import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace.js';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError | Error) => void,
) => void;
