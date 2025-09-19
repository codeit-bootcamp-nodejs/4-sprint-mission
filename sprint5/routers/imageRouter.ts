import type { Request, Response } from "express";
import express from "express";
import multer from "multer";

const router = express();

const upload = multer({ dest: "upload/" });

router.post("/", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "이미지가 업로드되지 않았습니다." });
  }

  const filename = req.file.filename;
  const path = `/profile/${filename}`;
  res.json({ path });
});

export default router;
