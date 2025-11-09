import express from "express";
import cookieParser from "cookie-parser";
import router from "./routers/index";
import { PORT } from "./lib/constants";
import passport from "./lib/passport/index";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import http from "http";
import { Server } from "socket.io";
import { registerSocket } from "./socket";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(router);
app.use("/download", express.static("uploads"));
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

registerSocket(io);

export { io };

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
