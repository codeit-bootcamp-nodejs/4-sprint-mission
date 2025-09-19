import express from "express";
import ProductController from "../controllers/product.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { validateDto, validateParams } from "../middlewares/validator.js";
import { ProductDto } from "../services/product/product.dto.js";
import { ProductIdParamDto } from "../services/product/product-params.dto.js";

const router = express.Router();

router.post("/", authenticate, validateDto(ProductDto), ProductController.createProduct);
router.get("/:id", validateParams(ProductIdParamDto), ProductController.findUniqueProduct);
router.patch(
  "/:id",
  authenticate,
  validateParams(ProductIdParamDto),
  validateDto(ProductDto),
  ProductController.patchProduct
);
router.delete("/:id", authenticate, validateParams(ProductIdParamDto), ProductController.deleteProduct);
router.get("/", ProductController.findManyProduct);

export default router;
