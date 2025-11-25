import express from "express";
import multer from "multer";
import passport from "../lib/passport";
import { PhotoController } from "../controllers/photoController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const controller = new PhotoController();

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  upload.single("image"),
  controller.upload
);

export default router;
