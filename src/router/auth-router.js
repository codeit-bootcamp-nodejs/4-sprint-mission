import express from "express";
import { register, login, refresh, logout } from "../controllers/auth-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authMiddleware, logout); // allDevices 로그아웃 시 인증 필요

export default router;
