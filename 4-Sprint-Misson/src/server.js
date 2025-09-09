import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import productRoutes from "./routes/productRoutes.js";


dotenv.config();
const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);
app.use("/products", productRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
