import dotenv from 'dotenv';
dotenv.config();

export const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || '';
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || '';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';

// AWS S3 Configuration
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
export const AWS_S3_REGION = process.env.AWS_S3_REGION || 'ap-northeast-2';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
