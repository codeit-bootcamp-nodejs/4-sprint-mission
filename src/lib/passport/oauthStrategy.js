import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../constants.js";
import prisma from "../prisma.js";

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

    const newUser = await prisma.user.create({
      data: {
        provider: "google",
        providerId: profile.id,
        username: profile.id,
        password: null,
      },
    });

    return cb(null, newUser);
  }
);
