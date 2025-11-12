import express from "express";
import passport from "../lib/passport";
import { AlertController } from "../controllers/alertController";

const router = express.Router();
const controller = new AlertController();

// 내 알림 조회
router.get("/", passport.authenticate("access-token", { session: false }), controller.list);

// 알림 읽음 처리
router.patch("/:id/read", passport.authenticate("access-token", { session: false }), controller.markAsRead);

export default router;
