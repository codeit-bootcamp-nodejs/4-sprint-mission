"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("./product.controller");
const express_1 = __importDefault(require("express"));
const product_validation_1 = require("./product.validation");
const ProductInstance = new product_controller_1.ProductController();
const router = express_1.default.Router();
// 제품 리스트 조회 API
// validation 파일 분리
// 에러 상태코드 분리// 수정
router.get("/", product_validation_1.ValidateProduct.validateQuery, async (req, res, next) => {
    console.log("Request Query :", req.query);
    const query = req.validatedQuery;
    ProductInstance.getProductListCont(query, res, next);
});
// 제품 조회 API
// validation 파일 분리
// 에러 상태코드 분리// 수정
router.get("/:id", product_validation_1.ValidateProduct.validateParams, async (req, res, next) => {
    console.log("After ,validateParams req.params:", req.params);
    next();
}, async (req, res, next) => {
    const params = req.validatedParams;
    const result = await ProductInstance.getProductCont(params, res, next);
    //console.log("result : ", result)
});
// 제품 생성 API
// validation 파일 분리
// 에러 상태코드 분리|| 수정
// todo: 디버깅
router.post("/", product_validation_1.ValidateProduct.validateBody, async (req, res, next) => {
    console.log("request body : ", req.body);
    await ProductInstance.createProductCont(req, res, next);
});
// 제품 정보 수정 API
// validation 파일 분리
// 에러 상태코드 분리// 수정
// todo: 디버깅
router.patch("/:id", product_validation_1.ValidateProduct.validateParams, product_validation_1.ValidateProduct.validateBody, async (req, res, next) => {
    const params = req.validatedParams;
    const body = req.validatedBody;
    await ProductInstance.modifiedProductCont(params, body, res, next);
});
// 제품 삭제 API
// validation 파일 분리
//  에러 상태코드 분리// 수정
// todo: 디버깅
router.delete("/:id", product_validation_1.ValidateProduct.validateParams, async (req, res, next) => {
    const params = req.validatedParams;
    await ProductInstance.poppedProductCont(params, res, next);
});
exports.default = router;
