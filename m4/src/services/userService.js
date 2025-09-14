import * as userRepository from '../repositories/userRepository.js';
import * as userUtils from '../utils/user.js';
import * as bcryptUtils from '../utils/bcrypt.js';
import { CustomError } from '../middlewares/errorHandler.js';

export const getUserById = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new CustomError('해당하는 사용자가 존재하지 않습니다.', 404);
    }
    return userUtils.omitPassword(user);
};

export const updateUser = async (userId, userData) => {
    // 비밀번호 관련 필드는 직접 수정하지 않도록 방지 (비밀번호 변경은 별도 API 고려)
    const { password, ...dataToUpdate } = userData;

    // 클라이언트가 비밀번호 변경을 시도해도 무시하도록
    if (password) {
        console.warn('User attempted to update password via /users/me endpoint. This is ignored.');
    }

    const updatedUser = await userRepository.updateUser(userId, dataToUpdate);

    if (!updatedUser) {
        throw new CustomError('사용자 정보 수정에 실패했습니다.', 500);
    }

    return userUtils.omitPassword(updatedUser);
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
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
