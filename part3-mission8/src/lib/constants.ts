declare global {}

// NODE_ENV, PORT 등은 크게 문제 없음
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

// 먼저 raw로 읽어온다
const ACCESS_SECRET_RAW = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET_RAW = process.env.REFRESH_TOKEN_SECRET;

// 존재하지 않으면 서버 바로 중단 (런타임 가드)
if (!ACCESS_SECRET_RAW || !REFRESH_SECRET_RAW) {
  throw new Error('JWT secrets are not set in environment variables');
}

// 여기서부터는 string으로 확정된 애만 export
const ACCESS_TOKEN_SECRET = ACCESS_SECRET_RAW as string;
const REFRESH_TOKEN_SECRET = REFRESH_SECRET_RAW as string;

const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';

export {
  NODE_ENV,
  PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
};
