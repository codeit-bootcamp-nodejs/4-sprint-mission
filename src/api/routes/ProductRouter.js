import express from "express";
import ProductController from "../controllers/ProductController.js";
import validateProduct from "../middlewares/validators/validateProduct.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validateProduct,
  ProductController.createProduct
);

router.get("/:id", ProductController.findUniqueProduct);

router.patch(
  "/:id",
  authenticate,
  validateProduct,
  ProductController.patchProduct
);

router.delete("/:id", authenticate, ProductController.deleteProduct);

router.get("/", ProductController.findManyProduct);

export default router;
