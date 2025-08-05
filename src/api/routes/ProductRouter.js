import express from "express";
import ProductController from "../controllers/ProductController.js";

const router = express.Router();

router.post("/", ProductController.createProduct);
router.get("/:id", ProductController.findUniqueProduct);
router.patch("/:id", ProductController.patchProduct);
router.delete("/:id", ProductController.deleteProduct);
router.get("/", ProductController.findManyProduct);

export default router;
