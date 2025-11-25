import express from "express";
import multer from "multer";
import passport from "../lib/passport";
import { PhotoController } from "../controllers/photoController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const controller = new PhotoController();

// ✅ 공통 업로드 엔드포인트
router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  upload.single("image"),
  controller.upload
);

export default router;
