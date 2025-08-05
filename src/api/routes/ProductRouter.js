import express from "express";
import ProductController from "../controllers/ProductController.js";
import validateProduct from "../middlewares/validateProduct.js";

const router = express.Router();

router.post("/", validateProduct, ProductController.createProduct);
router.get("/:id", ProductController.findUniqueProduct);
router.patch("/:id", validateProduct, ProductController.patchProduct);
router.delete("/:id", ProductController.deleteProduct);
router.get("/", ProductController.findManyProduct);

export default router;
