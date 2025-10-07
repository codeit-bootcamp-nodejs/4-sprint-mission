import express from "express";
import articleRouter from "../article/article.routes.js"; // 테스트할 라우터만 import
import userRoutes from"../user/user.routes.js"
import productRoutes from"../product/product.routes.js"
import commentRoutes from "../comment/comment.routes.js"
import authRoutes from"../auth/auth.routes.js"

const router = express.Router();

// 테스트할 라우터만 연결

router.use("/article", articleRouter);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use('/comment', commentRoutes);
router.use("/auth", authRoutes);
export default router