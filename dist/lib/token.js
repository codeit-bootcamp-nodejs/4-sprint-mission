import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET, } from '../lib/constants.js';
export function generateTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.id };
}
export function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.id };
}
//# sourceMappingURL=token.js.map