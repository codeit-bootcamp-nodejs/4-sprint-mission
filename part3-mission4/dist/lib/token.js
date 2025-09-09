import jwt, {} from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET, } from './constants.js';
import AppError from './appError.js';
function generateTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
    return {
        accessToken,
        refreshToken,
    };
}
function verifyAccessToken(token) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    if (typeof decoded === 'string') {
        throw new AppError('유효하지 않은 토큰 형식입니다.');
    }
    return { userId: decoded.id };
}
function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    if (typeof decoded === 'string') {
        throw new AppError('유효하지 않은 토큰 형식입니다.');
    }
    return { userId: decoded.id };
}
export { generateTokens, verifyAccessToken, verifyRefreshToken };
//# sourceMappingURL=token.js.map