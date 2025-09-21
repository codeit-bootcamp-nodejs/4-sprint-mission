import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import UserService from '../UserService';
import UserRepository from '../repositories/UserRepository';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Initialize repositories and services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const usersController = new UsersController(userService);

// 회원가입 API
router.post('/sign-up', usersController.signUp);

// 로그인 API
router.post('/sign-in', usersController.signIn);

// 내 정보 조회 API
router.get('/me', authMiddleware, usersController.getMe);

// 내 정보 수정 API
router.patch('/me', authMiddleware, usersController.updateMe);

// 비밀번호 변경 API
router.patch('/me/password', authMiddleware, usersController.changePassword);

// 내가 작성한 상품 목록 조회 API
router.get('/me/products', authMiddleware, usersController.getMyProducts);

// Token 재발급 API
router.post('/token/refresh', usersController.refreshToken);

export default router;
