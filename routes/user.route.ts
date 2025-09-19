import { Router } from "express";
import {
  signupController,
  loginController,
  inquiryController,
  editUserController,
  editPasswordController,
  refreshController,
  listupController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/sign", signupController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.get("/", authMiddleware, inquiryController);
router.put("/", authMiddleware, editUserController);
router.put("/password", authMiddleware, editPasswordController);
router.get("/listup", authMiddleware, listupController);

export default router;
