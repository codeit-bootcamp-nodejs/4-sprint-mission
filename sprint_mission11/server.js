require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// 🔹 Postgres 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🔹 업로드 폴더 설정 (컨테이너 안에서 /usr/src/app/uploads)
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
});

// 필요하면 JSON 파싱 (선택)
app.use(express.json());

// 🔹 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

// 🔹 /home 라우트 (원하면 유지)
app.get("/home", (req, res) => {
  res.send("This is /home route");
});

// 🔹 DB 연결 확인용 라우트
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    console.error("DB health check error:", err);
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

// 🔹 파일 업로드 라우트
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    savedAs: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
