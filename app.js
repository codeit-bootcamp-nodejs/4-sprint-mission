import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRouter from "./router/product.js";
import articleRouter from "./router/article.js";
import commentRouter from "./router/comment.js";
import { ErrorHandler } from "./middleware/errorhandler.js";
import upload from "./middleware/multer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/product", productRouter);
app.use("/article", articleRouter);
app.use("/comment", commentRouter);

app.use("/uploads", express.static("uploads"));

app.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }
  const path = `/uploads/${req.file.filename}`;
  res.json({ path });
});

app.get("/", (req, res) => {
  res.send("어서오세요");
});

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`서버 실행 중 : http://localhost:${PORT}`);
});
