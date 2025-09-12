import express from "express";
import AuthController from "../controllers/AuthController.js";
import validate from "../middlewares/validate.js";
import { signupSchema, loginSchema } from "../middlewares/validators/validateUser.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
export default router;
