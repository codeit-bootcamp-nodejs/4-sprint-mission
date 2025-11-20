import { ExtendedError, Server, Socket } from 'socket.io';
import http from 'http';
import * as authService from './authService';
import { Notification } from '../types/Notification';
import User from '../types/User';

class SocketService {
  private io: Server;

  constructor() {
    this.io = new Server();
    this.io.use(this.authenticate);
  }

  private async authenticate(socket: Socket, next: (err?: ExtendedError) => void) {
    let user: User;
    try {
      const accessToken = socket.handshake.auth.accessToken;
      user = await authService.authenticate(accessToken);
    } catch (error) {
      console.log('error', error);
      next(error as ExtendedError);
      return;
    }
    socket.join(user.id.toString());
    next();
  }

  initialize(httpServer: http.Server) {
    this.io.attach(httpServer);
  }

  sendNotification(notification: Notification) {
    const userId = notification.userId;
    this.io.to(userId.toString()).emit('notification', notification);
  }
}

export default new SocketService();
