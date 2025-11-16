import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  sendNotification,
} from "./notificationController";


const NotificationRoutes = Router();


NotificationRoutes.get("/", getNotifications);
NotificationRoutes.get("/unread-count", getUnreadCount);
NotificationRoutes.patch("/:id/read", markAsRead);
NotificationRoutes.post("/send", sendNotification);


export default NotificationRoutes;