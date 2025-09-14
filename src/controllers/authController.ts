import { Response } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import prisma from '../utils/prisma';
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
  cleanupExpiredTokens
} from '../utils/auth';
import { 
  AuthenticatedRequest,
  SignupRequest, 
  LoginRequest, 
  RefreshTokenRequest,
  TokenResponse,
  ApiResponse
} from '../types';

// 회원가입 유효성 검사 규칙
export const signupValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('올바른 이메일 형식이 아닙니다.')
    .normalizeEmail(),
  body('nickname')
    .isLength({ min: 2, max: 20 })
    .withMessage('닉네임은 2~20자 사이여야 합니다.')
    .matches(/^[가-힣a-zA-Z0-9_]+$/)
    .withMessage('닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문과 숫자를 포함해야 합니다.')
];

// 로그인 유효성 검사 규칙
export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('올바른 이메일 형식이 아닙니다.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
];

// 회원가입
export const signup = async (
  req: AuthenticatedRequest & { body: SignupRequest },
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    // 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: '유효성 검사 실패',
        details: errors.array()
      });
      return;
    }

    const { email, nickname, password } = req.body;

    // 이메일 중복 검사
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      res.status(409).json({
        error: '이미 사용 중인 이메일입니다.'
      });
      return;
    }

    // 닉네임 중복 검사
    const existingUserByNickname = await prisma.user.findFirst({
      where: { nickname }
    });

    if (existingUserByNickname) {
      res.status(409).json({
        error: '이미 사용 중인 닉네임입니다.'
      });
      return;
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      data: { user }
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 로그인
export const login = async (
  req: AuthenticatedRequest & { body: LoginRequest },
  res: Response<TokenResponse>
): Promise<void> => {
  try {
    // 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: '유효성 검사 실패',
        details: errors.array()
      } as any);
      return;
    }

    const { email, password } = req.body;

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        error: '이메일 또는 비밀번호가 올바르지 않습니다.'
      } as any);
      return;
    }

    // 비밀번호 검증
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        error: '이메일 또는 비밀번호가 올바르지 않습니다.'
      } as any);
      return;
    }

    // 토큰 생성
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Refresh Token을 DB에 저장
    await saveRefreshToken(user.id, refreshToken);

    // 만료된 토큰 정리
    await cleanupExpiredTokens();

    // 사용자 정보 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: '로그인이 완료되었습니다.',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};

// 토큰 갱신
export const refreshTokens = async (
  req: AuthenticatedRequest & { body: RefreshTokenRequest },
  res: Response<TokenResponse>
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        error: 'Refresh token이 필요합니다.'
      } as any);
      return;
    }

    // Refresh Token 검증
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        error: '유효하지 않은 refresh token입니다.'
      } as any);
      return;
    }

    // DB에서 Refresh Token 확인
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      res.status(401).json({
        error: '만료된 refresh token입니다.'
      } as any);
      return;
    }

    // 새로운 토큰 생성
    const newAccessToken = generateAccessToken(storedToken.userId);
    const newRefreshToken = generateRefreshToken(storedToken.userId);

    // 기존 Refresh Token 삭제 및 새로운 Token 저장
    await deleteRefreshToken(refreshToken);
    await saveRefreshToken(storedToken.userId, newRefreshToken);

    // 사용자 정보 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = storedToken.user;

    res.status(200).json({
      message: '토큰이 갱신되었습니다.',
      user: userWithoutPassword,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};

// 로그아웃
export const logout = async (
  req: AuthenticatedRequest & { body: RefreshTokenRequest },
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Refresh Token을 DB에서 삭제
      await deleteRefreshToken(refreshToken);
    }

    res.status(200).json({
      message: '로그아웃이 완료되었습니다.'
    });

  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};