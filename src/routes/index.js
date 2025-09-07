import express from "express";
import articleRouter from "./articleRouter.js";
import productRouter from "./productRouter.js";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import articleCommentRouter from "./articleCommentRouter.js";
import productCommentRouter from "./productCommentRouter.js";
import imageRouter from "./imageRouter.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send();
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/articles", articleRouter);
router.use("/products", productRouter);
router.use("/articles", articleCommentRouter);
router.use("/products", productCommentRouter);
router.use("/api/images", imageRouter);

export default router;
