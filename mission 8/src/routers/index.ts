import express from "express";

import userRouter from "./userRouter";
import articleRouter from "./articleRouter";
import productRouter from "./productRouter";
import commentRouter from "./commentRouter";
import likeRouter from "./likeRouter";
import photoRouter from "./photoRouter";  // ✅ 공통 업로드 전용
import alertRouter from "./alertRouter";

const router = express.Router();

router.use("/users", userRouter);
router.use("/articles", articleRouter);
router.use("/products", productRouter);
router.use("/comments", commentRouter);
router.use("/likes", likeRouter);
router.use(photoRouter);  // 📌 prefix는 /photos
router.use("/alerts", alertRouter);

export default router;