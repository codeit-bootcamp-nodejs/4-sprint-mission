"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
var jsonwebtoken_1 = require("jsonwebtoken");
var constants_js_1 = require("./constants.js");
function generateTokens(userId) {
    var accessToken = jsonwebtoken_1.default.sign({ id: userId }, constants_js_1.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    var refreshToken = jsonwebtoken_1.default.sign({ id: userId }, constants_js_1.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
}
function verifyAccessToken(token) {
    var decoded = jsonwebtoken_1.default.verify(token, constants_js_1.JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.id };
}
function verifyRefreshToken(token) {
    var decoded = jsonwebtoken_1.default.verify(token, constants_js_1.JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.id };
}
