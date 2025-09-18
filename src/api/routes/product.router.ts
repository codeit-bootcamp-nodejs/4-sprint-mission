import express from "express";
import ProductController from "../controllers/product.controller.js";
import authenticate from "../middlewares/authenticate.js";
import validate from "../middlewares/validate.js";
import { ProductSchema } from "../types/dtos/product.dto.js";

const router = express.Router();

router.post("/", authenticate, validate(ProductSchema), ProductController.createProduct);
router.get("/:id", ProductController.findUniqueProduct);
router.patch("/:id", authenticate, validate(ProductSchema), ProductController.patchProduct);
router.delete("/:id", authenticate, ProductController.deleteProduct);
router.get("/", ProductController.findManyProduct);

export default router;
