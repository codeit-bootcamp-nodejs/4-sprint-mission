import express from "express";
import * as dotenv from "dotenv";
import ProductRouter from "./routers/product";
import ArticleRouter from "./routers/article";
import userRouter from "./routers/users";
import ErrorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import passports from "./lib/passport/index";
import http from "http";
import { Server } from "socket.io";
import { initialize } from "./lib/socket-manager";

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

initialize(io);

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(passports.passport.initialize());

app.use("/users", userRouter);
app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);

app.use(ErrorHandler);

export default app;

app.listen(PORT, () => {
  console.log("server running");
});
