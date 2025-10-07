"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_routes_1 = __importDefault(require("../auth/auth.routes"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
const usercontroller = new user_controller_1.UserController();
router.use("/auth", auth_routes_1.default);
// 유저 API
// 유저 정보 조회
// validataion && 에러 메시지 분리
//  디버깅
router.get("/:id", user_validation_1.UserValidation.validateUserAccessById, async (req, res, next) => usercontroller.getUserInfoCont(req, res, next));
// 유저 회원 정보 수정
// validataion && 에러 메시지 분리
// todo : 로그인한 상태여야 
//  디버깅
router.patch("/:id", user_validation_1.UserValidation.validateUserAccessById, user_validation_1.UserValidation.validateUpdateUser, async (req, res, next) => usercontroller.patchUserCont(req, res, next));
// 유저 회원 비밀번호 수정
// validataion && 에러 메시지 분리
// todo : 로그인한 상태여야 
//  디버깅
router.patch("/:id/password", user_validation_1.UserValidation.validateUserAccessById, (req, res, next) => {
    console.log("After validateUserAccessById, req.body:", req.body);
    next();
}, user_validation_1.UserValidation.validateUpdateUserPassword, (user_validation_1.UserValidation.validateUpdateUserPassword, (req, res, next) => {
    console.log("After validateUpdateUserPassword, req.validatedBody:", req.validatedBody);
    next();
}), async (req, res, next) => usercontroller.patchUserPassword(req, res, next));
//유저가 등록한 상품 리스트 조회
// validataion && 에러 메시지 분리
// todo:  디버깅
exports.default = router;
