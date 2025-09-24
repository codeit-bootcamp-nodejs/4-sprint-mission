import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../constants.js";
import prisma from "../prisma.js";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth 환경 변수가 설정되지 않았습니다.");
}

export const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async function (accessToken, refreshToken, profile, cb) {
    const user = await prisma.user.findUnique({
      where: { provider: "google", providerId: profile.id },
    });
    if (user) {
      return cb(null, user);
    }
    const email = profile.emails?.[0]?.value;
    if (!email)
      return cb(new Error("Google 계정에 이메일이 필요합니다."), false);

    const newUser = await prisma.user.create({
      data: {
        provider: "google",
        providerId: profile.id,
        nickname: profile.id,
        email,
        password: null,
      },
    });

    return cb(null, newUser);
  }
);
