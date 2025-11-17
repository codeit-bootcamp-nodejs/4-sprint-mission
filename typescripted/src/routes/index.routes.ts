import express from "express";
import productRouter from "../product/product.routes";
import articleRouter from "../article/article.routes";
import userRouter from "../user/user.routes";
import commentRouter from "../comment/comment.routes";
import errorHandler from "../middleware/errorMiddle";
const router = express.Router();

router.use("/product", productRouter);

router.use("/article", articleRouter);

router.use("/comment", commentRouter);

router.use("/user", userRouter);


export default router;
