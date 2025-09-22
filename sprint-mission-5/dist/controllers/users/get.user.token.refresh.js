import createError from "http-errors";
import { setJwtTokens } from "../../lib/token.js";
function userTokenRefresh(req, res, next) {
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        const tokens = setJwtTokens(String(req.user.id), res);
        res.status(200).json({
            message: "세션 갱신",
            data: {
                accessHeader: tokens.accessToken,
                refreshHeader: tokens.refreshToken,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
export default userTokenRefresh;
//# sourceMappingURL=get.user.token.refresh.js.map