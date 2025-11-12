import express from "express";
import type { Request, Response, NextFunction } from "express";
import { validateBody } from "../../middleware/validateMiddle.js";
import { bodySchema } from "../../validation/notification.validation.js";
import { NotificationController } from "../../controller/notification.controller.js";
import { WebsocketService } from "../../socket/socket.js";
import { createServer } from "http";
import passport from "passport";
import app from "../../index.js";
import type { Server as HttpServer } from "http";
export default function createNotificationAsMarkedReadRouter(server: HttpServer) {
  const router = express.Router();
  const wss = new WebsocketService(server);
  const notificationController = new NotificationController(wss);

  router.patch(
    "/:id",
    passport.authenticate("local", { session: false }),
    validateBody(bodySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await notificationController.modifyStatus(req, res, next);
    }
  );

  return router;
}
