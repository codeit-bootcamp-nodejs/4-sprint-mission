import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import router from "./src/routes/index.js";
import errorHandler from "./src/middleware/errorHandler.js";
import path from "path";

dotenv.config(); // process.env 객체에 환경변수의 key-value 값을 넣어줌.

const app = express();

app.use(
  cors({
    origin: process.env.APP_BASE_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/images", express.static(path.join(process.cwd(), "uploads")));

app.use("/", router);

// 404처리
app.use((req, res, next) => {
  res.status(404).json({ error: "존재하지 않는 주소입니다." });
});

// 에러 핸들러 미들웨어
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 ${port}에서 시작되었습니다.`);
});
