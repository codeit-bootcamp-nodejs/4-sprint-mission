import express from "express";
import ProductController from "../controllers/ProductController.js";
import authenticate from "../middlewares/authenticate.js";
import validate from "../middlewares/validators/validate.js";
import { ProductSchema } from "../middlewares/validators/validateProduct.js";
const router = express.Router();

router.post("/", authenticate, validate(ProductSchema), ProductController.createProduct);
router.get("/:id", ProductController.findUniqueProduct);
router.patch("/:id", authenticate, validate(ProductSchema), ProductController.patchProduct);
router.delete("/:id", authenticate, ProductController.deleteProduct);
router.get("/", ProductController.findManyProduct);

export default router;
