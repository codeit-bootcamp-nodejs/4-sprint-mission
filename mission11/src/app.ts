import express from "express";
import cookieParser from "cookie-parser";
import router from "./routers/index";
import passport from "./lib/passport/index";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import http from "http";
import { initIo } from "./socket/io"; // ⬅ io 초기화 함수만 import
import { registerSocket } from "./socket/socket"; // ⬅ 소켓 이벤트 등록

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(router);

app.use(errorHandler);

const server = http.createServer(app);

initIo(server);
registerSocket();

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

export { app, server };
export default app;