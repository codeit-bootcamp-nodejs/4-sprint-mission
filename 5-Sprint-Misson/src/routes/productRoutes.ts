import express from "express";
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/productController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/", authenticate, createProduct);
router.get("/:id", getProductById);
router.patch("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);
router.get("/", getProducts);

export default router;
