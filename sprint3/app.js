import express from "express";
import productRouter from "./routes/products.js";

const app = express();

app.use(express.json());

app.use("/products", productRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
