import express from 'express';
import { 
  signup, 
  signupValidation, 
  login, 
  loginValidation,
  refreshTokens,
  logout
} from '../controllers/authController';

const router = express.Router();

// 회원가입
router.post('/signup', signupValidation, signup);

// 로그인
router.post('/login', loginValidation, login);

// 토큰 갱신
router.post('/refresh', refreshTokens);

// 로그아웃
router.post('/logout', logout);

export default router;