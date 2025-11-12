import express from "express";
import type { Request, Response, NextFunction } from "express";
import { NotificationController } from "../../controller/notification.controller.js";
import { validateBody } from "../../middleware/validateMiddle.js";
import { bodySchema } from "../../validation/notification.validation.js";
import passport from "passport";
import { WebsocketService } from "../../socket/socket.js";

import type { Server as HttpServer } from "http";

export default function createNotification(server: HttpServer) {
  const router = express.Router();
  const wss = new WebsocketService(server);
  const notificationController = new NotificationController(wss);

  // 알림 전송
  router.post(
    "/",
    passport.authenticate("local", { session: false }),
    validateBody(bodySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      return notificationController.alertSend(req, res, next);
    }
  );
  return router;
}
