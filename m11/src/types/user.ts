import type { AuthenticatedUser } from './common.js';

// 사용자 생성 데이터
export interface CreateUserData {
    email: string;
    nickname: string;
    password: string;
}

// 사용자 업데이트 데이터
export interface UpdateUserData {
    nickname?: string;
    email?: string;
    image?: string;
}

// 비밀번호 업데이트 데이터
export interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
}

// 사용자 응답 타입 (비밀번호 제거)
export interface UserResponse extends AuthenticatedUser {
    createdAt: Date;
    updatedAt: Date;
}

// 사용자 요청 타입들
export interface GetMeRequest {
    user: AuthenticatedUser;
}

export interface UpdateMeRequest {
    body: {
        nickname?: string;
        email?: string;
        image?: string;
    };
    user: AuthenticatedUser;
}

export interface UpdatePasswordRequest {
    body: {
        currentPassword: string;
        newPassword: string;
    };
    user: AuthenticatedUser;
}
