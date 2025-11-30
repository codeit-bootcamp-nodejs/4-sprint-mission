import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://52.79.236.229/auth/google/callback";

// 테스트 환경이면 Google OAuth 등록 건너뛰기
if (process.env.NODE_ENV !== "test") {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      "⚠️ Google OAuth 환경변수가 설정되지 않았습니다. GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET을 설정해주세요."
    );
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID || "",
        clientSecret: GOOGLE_CLIENT_SECRET || "",
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Google 프로필 정보를 콜백으로 전달
          return done(null, profile);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // 세션 직렬화 (필요한 경우)
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}

export default passport;
