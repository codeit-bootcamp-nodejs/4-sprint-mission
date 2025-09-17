import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 최대 업로드 파일 크기 5MB 제한
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/"))
      cb(null, true); // 이미지면 업로드 허용
    else cb(new Error("이미지 파일만 업로드 가능합니다.")); // 아니면 에러 반환
  },
});
