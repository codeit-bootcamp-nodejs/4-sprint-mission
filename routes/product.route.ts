import { Router } from "express";
import {
  productRegisterController,
  productPutController,
  productDeleteController,
  productListupController,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, productRegisterController);
router.put("/:productId", authMiddleware, productPutController);
router.delete("/:productId", authMiddleware, productDeleteController);
router.get("/", authMiddleware, productListupController);

export default router;
