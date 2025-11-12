import dotenv from "dotenv";
import express from "express";
import createApiRouter from "./routes/index.routes.js"
import cors from "cors";
import type { Server as HttpServer } from "http";

export default function initializeRoutes(server: HttpServer) {
  dotenv.config();
  const PORT = process.env.PORT || 3000;
  const app = express();
  app.use(express.json());

  app.use(cors());

  app.use("/api", createApiRouter(server));
  return app;
}
