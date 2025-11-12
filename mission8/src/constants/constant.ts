export const STATUS_CODE = {
  NOT_FOUND: 404,
  CREATED: 201,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
  TOO_MANY_REQUESTS: 429,
};

export const MESSAGE = {
  unauthorized: '로그인이 필요합니다',
  invalidToken: '유효하지 않은 토큰입니다',
  forbidden: '권한이 없습니다',
  refreshTokenNotFound: '리프레시 토큰을 찾을 수 없습니다',
  invalidCredentials: '이메일 또는 비밀번호가 잘못되었습니다',
  userAuthenticated: '사용자가 성공적으로 인증되었습니다',

  userNotFound: '유저를 찾을 수 없습니다',
  postNotFound: '게시글을 찾을 수 없습니다',
  notificationNotFound: '해당 알림을 찾을 수 없습니다',

  badRequest: '잘못된 요청입니다',
  tooManyRequests: '요청이 너무 많습니다. 잠시 후 시도해주세요',
  serverError: '문제가 발생했습니다. 나중에 다시 시도하세요',

  successUpdatePrice: '가격이 성공적으로 변경되었습니다',
};
