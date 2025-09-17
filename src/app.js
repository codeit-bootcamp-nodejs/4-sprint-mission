import "dotenv/config";
import express from "express";

import authRouter from "./routes/auth-router.js";
import usersRouter from "./routes/users-router.js";
import productsRouter from "./routes/products-router.js";
import postsRouter from "./routes/posts-router.js";

const app = express();
app.use(express.json());

// 라우터 등록
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/posts", postsRouter);

// 기본 헬스체크
app.get("/", (req, res) => res.send("OK"));

/** 글로벌 에러 핸들러(선택) */
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.status || 500).json({ message: err.message || "서버 에러" });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
