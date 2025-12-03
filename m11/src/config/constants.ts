import { parseExpiresIn } from '../utils/time.js';
import type { Secret } from 'jsonwebtoken';

// 필수 환경변수 검증 함수
const getRequiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`필수 환경변수 ${key}가 설정되지 않았습니다.`);
    }
    return value;
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.PORT || '3000', 10);

// JWT (필수 환경변수)
const JWT_ACCESS_TOKEN_SECRET: Secret = getRequiredEnv('JWT_ACCESS_TOKEN_SECRET');
const JWT_REFRESH_TOKEN_SECRET: Secret = getRequiredEnv('JWT_REFRESH_TOKEN_SECRET');
const JWT_ACCESS_TOKEN_COOKIE_NAME = process.env.JWT_ACCESS_TOKEN_COOKIE_NAME || 'accessToken';
const JWT_REFRESH_TOKEN_COOKIE_NAME = process.env.JWT_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
const JWT_ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h';
const JWT_REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d';

// 밀리초 단위 변수
const JWT_ACCESS_TOKEN_EXPIRES_IN_MS = parseExpiresIn(JWT_ACCESS_TOKEN_EXPIRES_IN);
const JWT_REFRESH_TOKEN_EXPIRES_IN_MS = parseExpiresIn(JWT_REFRESH_TOKEN_EXPIRES_IN);

// Session
const SESSION_SECRET = process.env.SESSION_SECRET || 'default_session_secret';

// File upload
const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 5 * 1024 * 1024; // 5MB

// AWS S3
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-2';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_S3_BASE_URL = process.env.AWS_S3_BASE_URL;

// Environment
const IS_PRODUCTION = NODE_ENV === 'production';

export {
    NODE_ENV,
    PORT,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_COOKIE_NAME,
    JWT_REFRESH_TOKEN_COOKIE_NAME,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_ACCESS_TOKEN_EXPIRES_IN_MS,
    JWT_REFRESH_TOKEN_EXPIRES_IN_MS,
    SESSION_SECRET,
    UPLOAD_PATH,
    MAX_FILE_SIZE,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_S3_BUCKET,
    AWS_S3_BASE_URL,
    IS_PRODUCTION,
};
