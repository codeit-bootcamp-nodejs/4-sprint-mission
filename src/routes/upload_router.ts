import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";

const router = express.Router();
const UPLOADS_FOLDER = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_FOLDER))
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.array("files", 3), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "업로드할 파일이 없습니다." });
  }
  const urls = files.map(
    (file) => `http://localhost:3000/uploads/${file.filename}`
  );
  res.status(201).json({ urls });
});

export default router;
