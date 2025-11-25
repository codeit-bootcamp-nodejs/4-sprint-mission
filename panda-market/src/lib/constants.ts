import 'dotenv/config';
import type { Secret } from 'jsonwebtoken';
import { InternalServerError } from '@/lib/errors.js';

const jwtAccessTokenSecret = process.env['JWT_ACCESS_TOKEN_SECRET'];
const jwtRefreshTokenSecret = process.env['JWT_REFRESH_TOKEN_SECRET'];
const cloudinary_cloud_name = process.env['CLOUDINARY_CLOUD_NAME'];
const cloudinary_api_key = process.env['CLOUDINARY_API_KEY'];
const cloudinary_api_secret = process.env['CLOUDINARY_API_SECRET'];
const google_client_id = process.env['GOOGLE_CLIENT_ID'];
const google_client_secret = process.env['GOOGLE_CLIENT_SECRET'];
const google_redirect_uri = process.env['GOOGLE_REDIRECT_URI'];
const kakao_client_api_key = process.env['KAKAO_CLIENT_API_KEY'];
const kakao_client_secret = process.env['KAKAO_CLIENT_SECRET'];
const kakao_redirect_uri = process.env['KAKAO_REDIRECT_URI'];
const node_env = process.env['NODE_ENV'];
const aws_access_key = process.env['AWS_ACCESS_KEY'];
const aws_secret_key = process.env['AWS_SECRET_KEY'];
const aws_region = process.env['AWS_REGION'];

// (타입 가드 역할)
if (!jwtAccessTokenSecret || !jwtRefreshTokenSecret) {
  throw new InternalServerError(
    'JWT 시크릿 키가 .env 파일에 설정되지 않았습니다.',
  );
}
if (process.env.NODE_ENV === 'production') {
  if (!aws_access_key || !aws_secret_key || !aws_region) {
    throw new InternalServerError(
      'aws 정보가 .env 파일에 설정되지 않았습니다.',
    );
  }
} else {
  if (!cloudinary_cloud_name || !cloudinary_api_key || !cloudinary_api_secret) {
    throw new InternalServerError(
      'cloudinary 정보가 .env 파일에 설정되지 않았습니다.',
    );
  }
}
if (!google_client_id || !google_client_secret || !google_redirect_uri) {
  throw new InternalServerError(
    '구글 로그인 api 정보가 .env 파일에 설정되지 않았습니다.',
  );
}
if (!kakao_client_api_key || !kakao_client_secret || !kakao_redirect_uri) {
  throw new InternalServerError(
    '카카오 로그인 api 정보가 .env 파일에 설정되지 않았습니다.',
  );
}

const JWT_ACCESS_TOKEN_SECRET: Secret = jwtAccessTokenSecret;
const JWT_REFRESH_TOKEN_SECRET: Secret = jwtRefreshTokenSecret;
const CLOUDINARY_CLOUD_NAME = cloudinary_cloud_name;
const CLOUDINARY_API_KEY = cloudinary_api_key;
const CLOUDINARY_API_SECRET = cloudinary_api_secret;
const REDIS_URL = process.env['REDIS_URL'];
const REDIS_KEY = process.env['REDIS_KEY'];
const GOOGLE_CLIENT_ID = google_client_id;
const GOOGLE_CLIENT_SECRET = google_client_secret;
const GOOGLE_REDIRECT_URI = google_redirect_uri;
const KAKAO_CLIENT_API_KEY = kakao_client_api_key;
const KAKAO_CLIENT_SECRET = kakao_client_secret;
const KAKAO_REDIRECT_URI = kakao_redirect_uri;
const AWS_ACCESS_KEY = aws_access_key;
const AWS_SECRET_KEY = aws_secret_key;
const AWS_REGION = aws_region;
const PORT = process.env['PORT'];

const NODE_ENV = node_env;

export {
  REDIS_URL,
  REDIS_KEY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  KAKAO_CLIENT_API_KEY,
  KAKAO_CLIENT_SECRET,
  KAKAO_REDIRECT_URI,
  NODE_ENV,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION,
  PORT,
};
