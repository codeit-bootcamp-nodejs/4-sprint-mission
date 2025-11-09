import express from "express";
import * as Notification from "../controllers/notification_controller";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router
  .get("/", authenticate, Notification.getNotificationsController)
  .get(
    "/:notificationId",
    authenticate,
    Notification.readNotificationController
  );
export default router;
