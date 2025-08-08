import express from "express";
import productRouter from "./routes/products.js";
import articleRouter from "./routes/articles.js";
import imageRouter from "./routes/image.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/photos", imageRouter);
app.use("/profile", express.static("/uploads"));
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
