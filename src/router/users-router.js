import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import {
  getMe, updateMe, changePassword,
  getMyProducts, getMyLikedProducts, getMyLikedPosts
} from "../controllers/users-controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.patch("/me/password", authMiddleware, changePassword);
router.get("/me/products", authMiddleware, getMyProducts);
router.get("/me/likes/products", authMiddleware, getMyLikedProducts);
router.get("/me/likes/posts", authMiddleware, getMyLikedPosts); // 옵션

export default router;
