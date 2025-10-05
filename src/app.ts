import express from "express";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";

import articleRoutes from "../src/routes/articleRoutes.js";
import authRoutes from "../src/routes/authRoutes.js";
import commentRoutes from "../src/routes/comments.js";
import productRoutes from "../src/routes/productRoutes.js";
import userRoutes from "../src/routes/users.js";

const app = express();
const PORT = 3000;

// ── Multer 설정 ──
const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "uploads/"); // 업로드 디렉토리
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── 미들웨어 ──
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ── 라우터 ──
app.use("/articles", articleRoutes);
app.use("/auth", authRoutes);
app.use("/comments", commentRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

// ── 기본 엔드포인트 ──
app.get("/", (_req: Request, res: Response) => {
  res.send("중고마켓 API 서버가 정상 실행 중입니다. /products 엔드포인트를 사용하세요.");
});

// ── 이미지 업로드 엔드포인트 ──
app.post("/images", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }
  console.log("이미지:", req.file);
  return res.json({ image: req.file.filename });
});

// ── 서버 시작 ──
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
