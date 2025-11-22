import express from "express";
import { authMiddleware } from "../middleware/index.js";
import { NotificationController } from "../controller/notification-controller.js";

const notificationRouter = (notificationController: NotificationController) => {
  const router = express.Router();

  // 내 알림 목록 조회
  router.get("/", authMiddleware, notificationController.getNotifications);

  // 안 읽은 알림 개수 조회
  router.get(
    "/unread-count",
    authMiddleware,
    notificationController.getUnreadCount
  );

  // 알림 읽음 처리
  router.patch(
    "/:notificationId/read",
    authMiddleware,
    notificationController.readNotification
  );

  return router;
};

export default notificationRouter;
