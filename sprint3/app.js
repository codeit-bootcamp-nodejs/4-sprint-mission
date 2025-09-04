import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./routers/productsRouter.js";
import articleRouter from "./routers/articlesRouter.js";
import imageRouter from "./routers/imageRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/photos", imageRouter);
app.use("/profile", express.static("/uploads"));
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
