import express from "express";
import type { Request, Response, NextFunction } from "express";
import sendRouter from "./send.routes.js";
import readRouter from "./mark_as_read.routes.js";
import { NotificationController } from "../../controller/notification.controller.js";
import { WebsocketService } from "../../socket/socket.js";
import {
  validateQuery,
  validateParam,
} from "../../middleware/validateMiddle.js";
import {
  paramsSchema,
  querySchema,
} from "../../validation/notification.validation.js";
import passport from "passport";
import type { Server as HttpServer } from "http";

export default function createNotification(server:HttpServer ) {
  const router = express.Router();
  const wss = new WebsocketService(server);
  const notificationController = new NotificationController(wss);

  router.use("/send", sendRouter);

  router.use("/mark_as_read", readRouter);

  // 알림 목록 조회
  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    validateQuery(querySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      return notificationController.accessAlerts(req, res, next);
    }
  );

  // 유저의 안 읽은 알림의 개수를 조회
  router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    validateParam(paramsSchema),
    validateQuery(querySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      return notificationController.accessAlertsCnt(req, res, next);
    }
  );

  return router;
}
