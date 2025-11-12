import { Router } from "express";
import {
  getMe,
  updateMe,
  changePassword,
  myProducts,
  likedProducts,
  likedPosts,
} from "../controllers/users.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

router.get("/", authRequired, getMe);
router.patch("/", authRequired, updateMe);
router.patch("/password", authRequired, changePassword);

router.get("/products", authRequired, myProducts);
router.get("/likes/products", authRequired, likedProducts);
router.get("/likes/posts", authRequired, likedPosts);

export default router;
