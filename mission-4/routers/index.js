import express from "express";
import articleRouter from "./article.js";
import productRouter from "./product.js";
import fileRouter from "./file.js";

const router = express.Router();

router.use("/article", articleRouter);
router.use("/product", productRouter);
router.use("/uploads", fileRouter);

export default router;
