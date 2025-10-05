import "express-session";

declare module "express-session" {
  interface SessionData {
    // 세션에 저장할 커스텀 데이터 키를 여기에 정의
    userId?: string;   // 예: 로그인한 사용자 ID
    // token?: string; // 필요한 값이 있으면 추가
  }
}
