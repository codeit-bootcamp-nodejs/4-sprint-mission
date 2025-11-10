import jwt from "jsonwebtoken";
import TOKEN from "./constants/jwt.tokens.js";
import * as cookieOptions from "./cookie-options.js";
function generateAccessToken(payloadId) {
    return jwt.sign({ id: payloadId }, TOKEN.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
}
function generateRefreshToken(payloadId) {
    return jwt.sign({ id: payloadId }, TOKEN.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
}
function setTokenCookies(res, tokens) {
    res.cookie(TOKEN.ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, cookieOptions.accessTokenOption);
    res.cookie(TOKEN.REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, cookieOptions.refreshTokenOption);
}
export function setJwtTokens(payloadId, res) {
    const tokens = {
        accessToken: generateAccessToken(payloadId),
        refreshToken: generateRefreshToken(payloadId),
    };
    setTokenCookies(res, tokens);
    return tokens;
}
export function clearJwtTokenCookies(res) {
    res.clearCookie(TOKEN.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(TOKEN.REFRESH_TOKEN_COOKIE_NAME);
}
//# sourceMappingURL=token.js.map