import express from "express";
import passport from "../lib/passport";
import { PhotoController } from "../controllers/photoController";
import { uploadS3 } from "../lib/s3"

const router = express.Router();
const controller = new PhotoController();

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  uploadS3.single("image"),
  controller.upload
);

export default router;
