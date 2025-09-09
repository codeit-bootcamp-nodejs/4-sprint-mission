import express from "express";
import { AuthController } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();
const controller = new AuthController();

// 로그인
router.post("/login", controller.login.bind(controller));

// 토큰 갱신
router.post("/refresh", controller.refresh.bind(controller));

// 로그아웃 - Access Token 필요
router.post("/logout", authenticate, controller.logout.bind(controller));

export default router;
