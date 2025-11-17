import WebSocket, { WebSocketServer } from "ws";
import { Socket } from "socket.io";
import http from "http";
interface PingMessage {
  type: "ping";
}

interface PongMessage {
  type: "pong";
}

export interface NotificationMessage {
  type: "notification";
  payload: NotificationPayload;
}
interface LikePayload {
  type: "NEW_LIKE";
  articleId?: number;
  productId?: number;
  likerName: string;
  userId: number;
  message: string;
}

interface NewCommentPayload {
  type: "NEW_COMMENT";
  articleId?: number;
  productId?: number;
  nickname: string;
  userId: number;
  message: string;
}

interface PricePayload {
  type: "CHANGED_PRICE";
  productId: number;
  userId: number;
  message: string;
}

export type WebSocketMessage = PingMessage | PongMessage | NotificationMessage;

export type NotificationPayload =
  | LikePayload
  | NewCommentPayload
  | PricePayload;

export class WebsocketService {
  private wss: WebSocketServer;
  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebsocket();
  }
  get clients() {
    return this.wss.clients;
  }
  public broadcast(message: WebSocketMessage) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  userSocketMap = new Map<number, Socket>();
  public emitToUser = (userId: number, event: string, payload: any) => {
    const socket = this.userSocketMap.get(userId);
    if (socket && socket.connected) {
      socket.emit(event, payload);
    }
  };
  private setupWebsocket() {
    this.wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (rawData) => {
        this.handleClientMessage(ws, rawData);
      });
    });
    this.wss.on("error", (error) => {
      console.error(error);
    });
  }

  private handleClientMessage(ws: WebSocket, rawData: WebSocket.RawData) {
    let message: WebSocketMessage;
    try {
      message = JSON.parse(rawData.toString()) as WebSocketMessage;
    } catch (error) {
      console.error(error);
      return;
    }
    switch (message.type) {
      case "ping":
        ws.send(JSON.stringify({ type: "pong" })); // 통신 연결
        break;
      case "notification":
        switch (message.payload.type) {
          case "NEW_LIKE":
          case "NEW_COMMENT":
          case "CHANGED_PRICE":
            break;
          default:
            console.error("Unknown notification type:", message.payload);
        }
        break;
      default:
        console.error("Invalid message type:", message.type);
        break;
    }
  }
}
