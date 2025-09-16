import { Router } from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { authRequired } from "../middlewares/auth.js";
import { ownerOnly } from "../middlewares/ownerOnly.js";
import { prisma } from "../prisma/client.js";

const router = Router();

// 전체 상품 목록 & 등록
router.get("/", listProducts);
router.post("/", authRequired, createProduct);

// 단일 상품 조회
router.get("/:id", getProduct);

// 수정 & 삭제 → 등록한 유저만 가능
router.patch(
  "/:id",
  authRequired,
  ownerOnly((req) => prisma.product.findUnique({ where: { id: parseInt(req.params.id) } })),
  updateProduct
);
router.delete(
  "/:id",
  authRequired,
  ownerOnly((req) => prisma.product.findUnique({ where: { id: parseInt(req.params.id) } })),
  deleteProduct
);

export default router;
