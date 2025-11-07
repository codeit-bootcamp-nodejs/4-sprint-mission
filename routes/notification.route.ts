import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { markAllNotificationAsRead, markNotificationAsRead, notificationList, unreadNotification } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", authMiddleware, notificationList);
router.get("/unread", authMiddleware, unreadNotification);
router.patch("/:id", authMiddleware, markNotificationAsRead);
router.patch("/read/all", authMiddleware, markAllNotificationAsRead);

export default router;