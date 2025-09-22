import express from "express";
import { UsersController } from "../controllers/usersController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();
const controller = new UsersController();

// 내 정보 조회 / 수정
router.get("/me", authenticate, controller.getProfile.bind(controller));
router.patch("/me", authenticate, controller.updateProfile.bind(controller));

// 비밀번호 변경
router.patch("/me/password", authenticate, controller.changePassword.bind(controller));

// 내가 등록한 상품 목록
router.get("/me/products", authenticate, controller.getMyProducts.bind(controller));

export default router;
