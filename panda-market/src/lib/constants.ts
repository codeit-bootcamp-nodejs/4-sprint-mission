import dotenv from 'dotenv';
import type { Secret } from 'jsonwebtoken';

dotenv.config();

const jwtAccessTokenSecret = process.env['JWT_ACCESS_TOKEN_SECRET'];
const jwtRefreshTokenSecret = process.env['JWT_REFRESH_TOKEN_SECRET'];
const cloudinary_cloud_name = process.env['CLOUDINARY_CLOUD_NAME'];
const cloudinary_api_key = process.env['CLOUDINARY_API_KEY'];
const cloudinary_api_secret = process.env['CLOUDINARY_API_SECRET'];
// (타입 가드 역할)
if (!jwtAccessTokenSecret || !jwtRefreshTokenSecret) {
  throw new Error('JWT 시크릿 키가 .env 파일에 설정되지 않았습니다.');
}
if (!cloudinary_cloud_name || !cloudinary_api_key || !cloudinary_api_secret) {
  throw new Error('cloudinary 정보가 .env 파일에 설정되지 않았습니다.');
}
const JWT_ACCESS_TOKEN_SECRET: Secret = jwtAccessTokenSecret;
const JWT_REFRESH_TOKEN_SECRET: Secret = jwtRefreshTokenSecret;
const CLOUDINARY_CLOUD_NAME = cloudinary_cloud_name;
const CLOUDINARY_API_KEY = cloudinary_api_key;
const CLOUDINARY_API_SECRET = cloudinary_api_secret;
const REDIS_URL = process.env['REDIS_URL'];
const REDIS_KEY = process.env['REDIS_KEY'];

export {
  REDIS_URL,
  REDIS_KEY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
};
