import express from "express";
import passport from "../lib/passport/index.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { imageUploadController } from "../controllers/imageUploadController.js";

const router = express.Router();

// 인증된 사용자만 업로드 가능하도록 설정
router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  uploadMiddleware.array("images", 5),
  imageUploadController
);

export default router;
