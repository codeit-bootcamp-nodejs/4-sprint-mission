import express from "express";
import multer from "multer";

const router = express();

const upload = multer({ dest: "upload/" });

router.post("/", upload.single("image"), (req, res) => {
  const filename = req.file.filename;
  const path = `/profile/${filename}`;
  res.json({ path });
});

export default router;
