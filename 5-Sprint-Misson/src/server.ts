
import express, { Application } from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import productRoutes from "./routes/productRoutes";
import usersRoutes from "./routes/usersRoutes";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);
app.use("/products", productRoutes);
app.use("/users", usersRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
