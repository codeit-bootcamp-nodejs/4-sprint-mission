import express from "express";
import {
  getProductList,
  getProduct,
  createProduct,
  modifyProduct,
  deletedProduct,
} from "./product.controller.js";
import {
  validateParams,
  validateBody,
  validateQuery,
} from "../../middlewares/validate.js";
import {
  productParamsSchema,
  productBodySchema,
  productPatchSchema,
  productQuerySchema,
} from "./product.validation.schema.js";
const router = express.Router();

router.get("/", validateQuery(productQuerySchema), getProductList);

router.get("/:id", validateParams(productParamsSchema), getProduct);

router.post("/", validateBody(productBodySchema), createProduct);

router.patch(
  "/:id",
  validateParams(productParamsSchema),
  validateBody(productPatchSchema),
  modifyProduct
);

router.delete("/:id", validateParams(productParamsSchema), deletedProduct);

export default router;
