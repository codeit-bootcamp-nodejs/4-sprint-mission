import { Router } from "express";
import { googleAuthController, googleAuthCallbackController } from "../controllers/user.controller.js";
const router = Router();

// Google OAuth 라우트
router.get("/google", googleAuthController);
router.get("/google/callback", googleAuthCallbackController);

export default router;