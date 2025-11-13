// Jest 테스트 설정 파일
import dotenv from "dotenv";

// 테스트 환경 변수 설정
dotenv.config({ path: ".env.test" });

// 테스트 환경에서 사용할 기본 환경 변수
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || "test-refresh-secret-key";

