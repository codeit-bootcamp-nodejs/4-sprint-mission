import * as userService from '../services/userService.js';
import { sendResponse } from '../utils/response.js';

export const getMe = async (req, res, next) => {
    try {
        // passport.authenticate()가 인증 후 req.user에 사용자 정보를 담아줍니다.
        const user = req.user;
        sendResponse(res, 200, '사용자 정보 조회 성공', user);
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const userId = req.user.id; // Passport가 req.user에 넣어준 사용자 ID
        const userData = req.body; // 클라이언트로부터 받은 수정 데이터

        // 서비스 함수 호출하여 사용자 정보 업데이트
        const updatedUser = await userService.updateUser(userId, userData);

        sendResponse(res, 200, '사용자 정보가 성공적으로 수정되었습니다.', updatedUser);
    } catch (error) {
        next(error);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const userId = req.user.id; // 인증된 사용자의 ID
        const { currentPassword, newPassword } = req.body;

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
