import express from "express";
import type { Request, Response, NextFunction } from "express";
import { ProductController } from "../controller/product.controller.js";
import {
  productIdSchema,
  createProductSchema,
  PatchProductSchema,
  accessListProductSchema,
} from "../validation/product.validation.js";
import {
  validateParam,
  validateBody,
  validateQuery,
} from "../middleWare/validateMiddle.js";
import passport from "passport";
import type { Server as HttpServer } from "http";

export default function createProductRouter(server: HttpServer) {
  const productController = new ProductController(server);
  const router = express.Router();
  // API : 상품 데이터 리스트 조회
  router.get(
    "/",
    validateQuery(accessListProductSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await productController.accessListProduct(req, res, next);
    }
  );

  // API : 상품 데이터 조회
  router.get(
    "/:id",
    validateParam(productIdSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await productController.accessProduct(req, res, next);
    }
  );

  // API : 상품 데이터 생성
  router.post(
    "/",
    passport.authenticate("local", { session: false }),
    validateBody(createProductSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await productController.createProduct(req, res, next);
    }
  );

  // API : 상품 정보 수정
  router.patch(
    "/:id",
    passport.authenticate("local", { session: false }),
    validateParam(productIdSchema),
    validateBody(PatchProductSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await productController.modifyProduct(req, res, next);
    }
  );

  // API : 상품 삭제
  router.delete(
    "/:id",
    passport.authenticate("local", { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
      await productController.deleteProduct(req, res, next);
    }
  );

  return router; // router 만 내보내기
}
