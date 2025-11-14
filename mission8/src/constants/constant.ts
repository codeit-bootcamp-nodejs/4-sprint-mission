export const STATUS_CODE = {
  OK: 200, // 요청 성공
  CREATED: 201, // 요청 성공으로 새로운 리소스 생성
  NO_CONTENT: 204, // 보내줄 수 있는 콘텐츠 없음
  BAD_REQUEST: 400, // 잘못된 문법
  UNAUTHORIZED: 401, // 인증 안 됨
  FORBIDDEN: 403, // 권리 없음
  NOT_FOUND: 404, // 리소스 찾을 수 없음
  CONFLICT: 409, // 요청이 서버 상태와 충돌
  TOO_MANY_REQUESTS: 429, // 너무 많은 요청 보냄
  INTERNAL_SERVER_ERROR: 500, // 서버 에러
};

export const MESSAGE = {
  userAuthenticated: '사용자가 성공적으로 인증되었습니다',
  successUpdatePrice: '가격이 성공적으로 변경되었습니다',

  refreshTokenNotFound: '리프레시 토큰을 찾을 수 없습니다',
  userNotFound: '유저를 찾을 수 없습니다',
  postNotFound: '게시글을 찾을 수 없습니다',
  productNotFound: '상품을 찾을 수 없습니다',
  notificationNotFound: '변경 가능한 알림을 찾을 수 없습니다',

  expiredToken: '토큰이 만료되었습니다',
  invalidToken: '유효하지 않은 토큰입니다',
  invalidCredentials: '이메일 또는 비밀번호가 잘못되었습니다',
  badRequest: '잘못된 요청입니다',

  unauthorized: '로그인이 필요합니다',
  forbidden: '권한이 없습니다',

  tooManyRequests: '요청이 너무 많습니다. 잠시 후 시도해주세요',
  serverError: '문제가 발생했습니다. 나중에 다시 시도하세요',
};
