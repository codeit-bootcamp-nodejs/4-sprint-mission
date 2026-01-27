import express from "express";
import productRouter from "./routes/product.routes";
import postRouter from "./routes/post.routes";
import authRouter from "./routes/auth.routes";

const app = express();
app.use(express.json());

// Routes
app.use("/products", productRouter);
app.use("/posts", postRouter);
app.use("/auth", authRouter);

export default app;
