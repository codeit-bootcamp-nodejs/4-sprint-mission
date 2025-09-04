import express from "express";
import router from "./routers/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = 3000;

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
