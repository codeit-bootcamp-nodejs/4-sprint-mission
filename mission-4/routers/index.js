import express from "express";
import articleRouter from "./article.js";
import productRouter from "./product.js";
import fileRouter from "./file.js";
import authRouter from "./auth.js";
import userRouter from "./user.js";

const router = express.Router();

router.use("/article", articleRouter);
router.use("/product", productRouter);
router.use("/uploads", fileRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
