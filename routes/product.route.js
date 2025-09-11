import { Router } from "express";
import {
  ProductRegisterController,
  ProductPutController,
  ProductDeleteController,
  ProductListupController,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/", authMiddleware, ProductRegisterController);
router.put("/:productId", authMiddleware, ProductPutController);
router.delete("/:productId", authMiddleware, ProductDeleteController);
router.get("/", authMiddleware, ProductListupController);
export default router;
