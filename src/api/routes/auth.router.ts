import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { validateDto } from "../middlewares/validator.js";
import { SignupDto, LoginDto } from "../services/auth/auth.dto.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

router.post("/signup", validateDto(SignupDto), AuthController.signup);
router.post("/login", validateDto(LoginDto), AuthController.login);
router.post("/logout", authenticate, AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);
export default router;
