import {
  ProductController,
  type RequestBody,
  ValidatedRequest,
} from "./product.controller";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { ValidateProduct } from "./product.validation";
import passport from "passport";

const ProductInstance = new ProductController();
const router = express.Router();

// 제품 리스트 조회 API
// validation 파일 분리
// 에러 상태코드 분리// 수정
router.get(
  "/",
  ValidateProduct.validateQuery,
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    console.log("Request Query :", req.query);
    const query = req.validatedQuery!;
    ProductInstance.getProductListCont(query, res, next)
  }
);

// 제품 조회 API
// validation 파일 분리
// 에러 상태코드 분리// 수정
router.get(
  "/:id",
  ValidateProduct.validateParams,
  async (req, res, next) => {
    console.log("After ,validateParams req.params:", req.params);
    next();
  },
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const params = req.validatedParams!;
    const result = await ProductInstance.getProductCont(params, res, next);
    //console.log("result : ", result)
  }
);
// 제품 생성 API
// validation 파일 분리
// 에러 상태코드 분리|| 수정
router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  ValidateProduct.validateBody,
  async (
    req: Request<{}, {}, RequestBody, {}>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("request body : ", req.body);

    await ProductInstance.createProductCont(req, res, next);
  }
);

// 제품 정보 수정 API
// validation 파일 분리
// 에러 상태코드 분리// 수정
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  ValidateProduct.validateParams,
  ValidateProduct.validateBody,
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const params = req.validatedParams!;
    const body = req.validatedBody!;
    const ownerId = req.user?.id;

    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    await ProductInstance.modifiedProductCont(params, body, res, next);
  }
);

// 제품 삭제 API
// validation 파일 분리
//  에러 상태코드 분리// 수정
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  ValidateProduct.validateParams,
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const params = req.validatedParams!;
    const ownerId = req.user?.id;

    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    await ProductInstance.poppedProductCont(params, res, next);
  }
);
export default router;
