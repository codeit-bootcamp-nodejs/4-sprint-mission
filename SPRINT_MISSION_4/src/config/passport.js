import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { PrismaClient as PrismaSqlite } from "../prisma/generated/sqlite/index.js";

const prisma = new PrismaSqlite();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer <token>
  secretOrKey: process.env.JWT_SECRET || "your_jwt_secret",
};

passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await prisma.user.findUnique({ where: { username } });
          if (!user) {
            return done(null, false, { message: "User not found" });
          } 
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, { message: "Invalid password" });
          } 
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    ),
    "jwt",
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await sqlite.user.findUnique({ where: { id: jwt_payload.id } });
            if (user) return done(null, user);
            return done(null, false);
        } catch (err) {
            return done(err, false);
        }
    })
);

export default passport;
