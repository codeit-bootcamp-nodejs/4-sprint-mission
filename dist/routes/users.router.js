"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = __importDefault(require("../controllers/UsersController"));
const UserService_1 = __importDefault(require("../UserService"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
// Initialize repositories and services
const userRepository = new UserRepository_1.default();
const userService = new UserService_1.default(userRepository);
const usersController = new UsersController_1.default(userService);
// 회원가입 API
router.post('/sign-up', usersController.signUp);
// 로그인 API
router.post('/sign-in', usersController.signIn);
// 내 정보 조회 API
router.get('/me', auth_middleware_1.default, usersController.getMe);
// 내 정보 수정 API
router.patch('/me', auth_middleware_1.default, usersController.updateMe);
// 비밀번호 변경 API
router.patch('/me/password', auth_middleware_1.default, usersController.changePassword);
// 내가 작성한 상품 목록 조회 API
router.get('/me/products', auth_middleware_1.default, usersController.getMyProducts);
// Token 재발급 API
router.post('/token/refresh', usersController.refreshToken);
exports.default = router;
