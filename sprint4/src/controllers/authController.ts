// src/controllers/authController.ts
import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { UserRegister, UserLogin, UserUpdate, PasswordChange } from '../types';

/**
 * 회원가입 요청을 처리합니다.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData: UserRegister = req.body;
        const newUser = await authService.register(userData);
        res.status(201).json({ message: '회원가입 성공', user: newUser });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'ConflictError') {
                res.status(409).json({ message: error.message });
            } else if (error.name === 'ValidationError') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        }
    }
};

/**
 * 로그인 요청을 처리합니다.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData: UserLogin = req.body;
        const result = await authService.login(userData);
        res.status(200).json({ message: '로그인 성공', ...result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: error.message });
            } else if (error.name === 'AuthenticationError') {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        }
    }
};

/**
 * Access Token 재발급 요청을 처리합니다.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json({ message: '토큰이 성공적으로 갱신되었습니다.', ...result });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};

/**
 * 로그아웃 요청을 처리합니다.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};

/**
 * 내 정보 조회 요청을 처리합니다.
 */
export const getMyInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const user = await authService.getMyInfo(userId);
        res.status(200).json({ user });
    } catch (error) {
        if (error instanceof Error && error.name === 'NotFoundError') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};

/**
 * 내 정보 수정 요청을 처리합니다.
 */
export const updateMyInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const userData: UserUpdate = req.body;
        const updatedUser = await authService.updateMyInfo(userId, userData);
        res.status(200).json({ message: '사용자 정보가 성공적으로 업데이트되었습니다.', user: updatedUser });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'NotFoundError') {
                res.status(404).json({ message: error.message });
            } else if (error.name === 'ValidationError') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        }
    }
};

/**
 * 비밀번호 변경 요청을 처리합니다.
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const passwordData: PasswordChange = req.body;
        await authService.changePassword(userId, passwordData);
        res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: error.message });
            } else if (error.name === 'AuthenticationError') {
                res.status(401).json({ message: error.message });
            } else if (error.name === 'NotFoundError') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        }
    }
};