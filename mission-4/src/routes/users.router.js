import express from "express";
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { UsersController } from "../controllers/users.controller.js";

const router = express.Router();
const usersController = new UsersController();

// 회원가입
router.post('/signup', usersController.signUp);

// 로그인
router.post('/login', usersController.signIn);

// 내 정보 조회
router.get('/users/me', authMiddleware, usersController.getMe);

// 내 정보 수정
router.put('/users/me', authMiddleware, usersController.updateMe);

// 비밀번호 변경
router.put('/users/me/password', authMiddleware, usersController.updatePassword);

// 내가 등록한 상품 목록 조회
router.get('/users/me/products', authMiddleware, usersController.getMyProducts);

// 내가 '좋아요' 누른 상품 목록 조회
router.get('/users/me/liked-products', authMiddleware, usersController.getLikedProducts);

// Access Token 재발급
router.post('/token/refresh', usersController.refreshToken);

// 프로필 이미지 업로드
router.put('/users/me/image', authMiddleware, upload.single('image'), usersController.updateProfileImage);

export default router;