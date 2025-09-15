import express from "express";
import multer from "multer";
import passport from "../lib/passport/index";
import prisma from "../lib/prisma";
import status from "http-status";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/users/photos",
  passport.authenticate("access-token", { session: false }),
  upload.single("image"),
  async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user;

    if (!req.file) {
      return res.status(status.NOT_FOUND).json({ message: "No file upload" });
    }

    try {
      const imageUrl = `/download/${req.file.filename}`;
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { image: imageUrl },
      });

      res.status(status.OK).json({
        message: "Photo uploaded successfully",
        image: updatedUser.image,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
