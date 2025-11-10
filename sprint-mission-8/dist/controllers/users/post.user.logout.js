import { clearJwtTokenCookies } from "../../lib/token.js";
import createHttpError from "http-errors";
export default function logoutUser(req, res, next) {
    if (!req.user) {
        return next(createHttpError(401, "비인가 유저"));
    }
    clearJwtTokenCookies(res);
    res.status(200).json({ message: "로그아웃" });
}
//# sourceMappingURL=post.user.logout.js.map