import passport from "passport";
import { localStrategy } from "./localStrategy.js";
import { accessTokenStrategy, refreshTokenStrategy } from "./jwtStrategy.js";
import TOKEN from "../constants/jwt.tokens.js";
passport.use("local", localStrategy);
passport.use(TOKEN.ACCESS_TOKEN_COOKIE_NAME, accessTokenStrategy);
passport.use(TOKEN.REFRESH_TOKEN_COOKIE_NAME, refreshTokenStrategy);
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//   const user = await prisma.user.findUnique({ where: { id } });
//   done(null, user);
// });
const passports = {
    passport: passport,
    local: passport.authenticate("local", { session: false }),
    jwtAccess: passport.authenticate(TOKEN.ACCESS_TOKEN_COOKIE_NAME, {
        session: false,
        failureRedirect: "/user/refresh",
    }),
    jwtRefresh: passport.authenticate(TOKEN.REFRESH_TOKEN_COOKIE_NAME, {
        session: false,
    }),
};
export default passports;
//# sourceMappingURL=index.js.map