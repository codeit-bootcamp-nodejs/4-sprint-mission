import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import optionalAuth from "../middlewares/optional-auth.js";
import {
  createProduct, listProducts, getProduct, updateProduct, deleteProduct,
  addProductComment, listProductComments, updateComment, deleteComment,
  likeProduct, unlikeProduct
} from "../controllers/products-controller.js";

const router = express.Router();

router.get("/", optionalAuth, listProducts);
router.get("/:productId", optionalAuth, getProduct);

router.post("/", authMiddleware, createProduct);
router.put("/:productId", authMiddleware, updateProduct);
router.delete("/:productId", authMiddleware, deleteProduct);

router.get("/:productId/comments", listProductComments);
router.post("/:productId/comments", authMiddleware, addProductComment);
router.put("/comments/:commentId", authMiddleware, updateComment);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

router.post("/:productId/like", authMiddleware, likeProduct);
router.delete("/:productId/like", authMiddleware, unlikeProduct);

export default router;
