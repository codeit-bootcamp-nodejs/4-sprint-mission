import type { AuthenticatedUser } from './common.js';

// API 응답용 User 타입 (비밀번호 제거)
export type SafeUser = AuthenticatedUser;

// 유저 생성 데이터
export interface CreateUserData {
    email: string;
    nickname: string;
    password: string;
}

// 로그인 입력 데이터
export interface LoginInput {
    email: string;
    password: string;
}

// 로그인 응답
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

// 토큰 재발급 응답
export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

// 토큰 레코드
export interface TokenRecord {
    userId: number;
    refreshToken: string;
    expiredAt: Date;
}

// 인증 요청 타입들
export interface LoginRequest {
    body: {
        email: string;
        password: string;
    };
}

export interface LogoutRequest {
    cookies: {
        [key: string]: string;
    };
}

export interface RefreshRequest {
    cookies: {
        [key: string]: string;
    };
}
