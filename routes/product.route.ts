import { Router } from "express";
import {
  productRegisterController,
  productPutController,
  productDeleteController,
  productListupController,
  productDetailController,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verifyProductOwner } from "../middlewares/verifyProductOwner.middleware.js";

const router = Router();

router.post("/", authMiddleware, productRegisterController);
router.put("/:productId", authMiddleware, verifyProductOwner, productPutController);
router.delete("/:productId", authMiddleware, productDeleteController);
router.get("/", productListupController);
router.get("/:productId", productDetailController);

export default router;
