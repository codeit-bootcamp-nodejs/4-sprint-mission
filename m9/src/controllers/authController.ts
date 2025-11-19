import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import { sendResponse } from '../utils/response.js';
import { NODE_ENV, JWT_REFRESH_TOKEN_COOKIE_NAME, JWT_REFRESH_TOKEN_EXPIRES_IN_MS } from '../config/constants.js';
import { CustomError } from '../middlewares/errorHandler.js';

// 회원가입
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, nickname, password } = req.body;

        if (!email || !nickname || !password) {
            return sendResponse(res, 400, '이메일, 닉네임, 비밀번호는 필수 입력값입니다.');
        }

        const newUser = await authService.signup(email, nickname, password);

        sendResponse(res, 201, '회원가입 성공', {
            id: newUser.id,
            email: newUser.email,
            nickname: newUser.nickname,
        });
    } catch (error) {
        next(error);
    }
};

// 로그인
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendResponse(res, 400, '이메일과 비밀번호는 필수 입력값입니다.');
        }
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }
        const user = req.user;

        const { accessToken, refreshToken } = await authService.login(user);

        res.cookie(JWT_REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            path: '/auth',
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: JWT_REFRESH_TOKEN_EXPIRES_IN_MS,
        });

        sendResponse(res, 200, '로그인 성공', { accessToken });
    } catch (error) {
        next(error);
    }
};

// 로그아웃
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshTokenFromClient = req.cookies[JWT_REFRESH_TOKEN_COOKIE_NAME];

        if (!refreshTokenFromClient) {
            return sendResponse(res, 400, '로그아웃할 Refresh Token이 쿠키에 없습니다.');
        }

        const result = await authService.logout(refreshTokenFromClient);
        res.clearCookie(JWT_REFRESH_TOKEN_COOKIE_NAME, {
            path: '/auth',
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
        });

        if (result) {
            sendResponse(res, 200, '로그아웃 성공');
        } else {
            sendResponse(res, 404, '이미 로그아웃된 상태입니다.');
        }
    } catch (error) {
        next(error);
    }
};

// 토큰 재발급
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshTokenFromClient = req.cookies[JWT_REFRESH_TOKEN_COOKIE_NAME];

        const { accessToken, refreshToken } = await authService.refresh(refreshTokenFromClient!);

        res.cookie(JWT_REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            path: '/auth',
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: JWT_REFRESH_TOKEN_EXPIRES_IN_MS,
        });

        sendResponse(res, 200, 'Access Token이 성공적으로 갱신되었습니다.', { accessToken });
    } catch (error) {
        next(error);
    }
};
