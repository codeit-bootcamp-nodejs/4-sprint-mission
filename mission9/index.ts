import express from "express";
import createApiRouter from "./routes/index.routes.js";
import cors from "cors";
import type { Server as HttpServer } from "http";

export default function initializeRoutes(server: HttpServer) {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // server 인자를 전달해야 함
  app.use("/api", createApiRouter(server));

  return app;
}