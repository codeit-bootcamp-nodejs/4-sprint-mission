"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
const authController = new auth_controller_1.AuthController();
//  에러 상태코드 분리// 수정
//  validation 파일 분리
// todo:인증
// todo: 디버깅 
router.post("/signup", async (req, res, next) => authController.createUserCont(req, res, next));
//  에러 상태코드 분리// 수정
//  validation 파일 분리
// todo:인증
// todo: 디버깅
router.post("/login", async (req, res, next) => authController.loginUserCont(req, res, next));
exports.default = router;
