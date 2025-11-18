import express from "express";
import passport from "../lib/passport/index";
import { notificationController } from "../controllers/notificationController";

const notificationRouter = express.Router();

notificationRouter
  .route("/")
  .get(
    passport.authenticate("access-token", { session: false }),
    notificationController.getNotificationsByUser
  );
notificationRouter
  .route("/unread-count")
  .get(
    passport.authenticate("access-token", { session: false }),
    notificationController.getUnreadCount
  );
notificationRouter
  .route("/:id/read")
  .patch(
    passport.authenticate("access-token", { session: false }),
    notificationController.markAsRead
  );

export default notificationRouter;
