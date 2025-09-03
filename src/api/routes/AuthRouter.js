import express from "express";
import AuthController from "../controllers/AuthController.js";
import hassingPassword from "../middlewares/hashing.js";
import validate from "../middlewares/validators/validate.js";
import {
  signupSchema,
  loginSchema,
} from "../middlewares/validators/validateUser.js";

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  hassingPassword(),
  AuthController.signup
);
router.post("/login", validate(loginSchema), AuthController.login); // 나중에 user 유효성 검사 추가
router.post("/refresh-token", AuthController.refreshToken);
export default router;
