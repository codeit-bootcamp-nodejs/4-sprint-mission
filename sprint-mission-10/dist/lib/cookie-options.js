"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenOption = exports.accessTokenOption = void 0;
const accessTokenOption = {
    httpOnly: true,
    secure: false,
    maxAge: 1 * 60 * 60 * 1000, // 1hour
};
exports.accessTokenOption = accessTokenOption;
const refreshTokenOption = {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
exports.refreshTokenOption = refreshTokenOption;
//# sourceMappingURL=cookie-options.js.map