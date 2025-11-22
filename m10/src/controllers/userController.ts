import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';
import * as productService from '../services/productService.js';
import { sendResponse } from '../utils/response.js';
import { CustomError } from '../middlewares/errorHandler.js';

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // passport.authenticate()가 인증 후 req.user에 사용자 정보를 담아줍니다.
        const user = req.user;
        sendResponse(res, 200, '사용자 정보 조회 성공', user);
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }
        const userId = req.user.id; // Passport가 req.user에 넣어준 사용자 ID
        const userData = req.body; // 클라이언트로부터 받은 수정 데이터

        // 서비스 함수 호출하여 사용자 정보 업데이트
        const updatedUser = await userService.updateUser(userId, userData);

        sendResponse(res, 200, '사용자 정보가 성공적으로 수정되었습니다.', updatedUser);
    } catch (error) {
        next(error);
    }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }
        const userId = req.user.id; // 인증된 사용자의 ID
        const { currentPassword, newPassword }: { currentPassword: string; newPassword: string } = req.body;

        if (!currentPassword || !newPassword) {
            return sendResponse(res, 400, '현재 비밀번호와 새 비밀번호는 필수입니다.');
        }

        // 비밀번호 변경 서비스 함수 호출
        await userService.updatePassword(userId, currentPassword, newPassword);

        sendResponse(res, 200, '비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
        next(error);
    }
};

export const getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }
        const userId = req.user.id;
        const products = await productService.findProductsByUserId(userId);
        sendResponse(res, 200, '내 상품 목록 조회 성공', products);
    } catch (error) {
        next(error);
    }
};
