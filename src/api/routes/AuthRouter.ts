import express from "express";
import AuthController from "../controllers/AuthController.js";
import validate from "../middlewares/validate.js";
import { loginSchema, signupSchema } from "../types/dtos/auth.dto.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/logout", authenticate, AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);
export default router;
