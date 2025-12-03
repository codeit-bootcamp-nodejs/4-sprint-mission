import * as userRepository from '../repositories/userRepository.js';
import * as userUtils from '../utils/user.js';
import * as bcryptUtils from '../utils/bcrypt.js';
import { CustomError } from '../middlewares/errorHandler.js';
import type { UpdateUserData } from '../types/user.js';

export const getUserById = async (userId: number) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new CustomError('해당하는 사용자가 존재하지 않습니다.', 404);
    }
    return userUtils.omitPassword(user);
};

export const updateUser = async (userId: number, userData: UpdateUserData) => {
    // UpdateUserData는 password를 포함하지 않으므로 직접 사용 가능
    const updatedUser = await userRepository.updateUser(userId, userData);

    if (!updatedUser) {
        throw new CustomError('사용자 정보 수정에 실패했습니다.', 500);
    }

    return userUtils.omitPassword(updatedUser);
};

export const updatePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    // 1. 현재 사용자 정보 조회
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new CustomError('사용자를 찾을 수 없습니다.', 404);
    }

    // 2. 현재 비밀번호 검증
    const isMatch = await bcryptUtils.comparePassword(currentPassword, user.password);
    if (!isMatch) {
        throw new CustomError('현재 비밀번호가 올바르지 않습니다.', 401);
    }

    // 3. 새 비밀번호 해싱
    const hashedPassword = await bcryptUtils.hashPassword(newPassword);

    // 4. DB에 새 비밀번호 업데이트
    await userRepository.updateUserPassword(userId, hashedPassword);
};

