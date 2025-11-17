"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setJwtTokens = setJwtTokens;
exports.clearJwtTokenCookies = clearJwtTokenCookies;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_tokens_js_1 = __importDefault(require("./constants/jwt.tokens.js"));
const cookieOptions = __importStar(require("./cookie-options.js"));
function generateAccessToken(payloadId) {
    return jsonwebtoken_1.default.sign({ id: payloadId }, jwt_tokens_js_1.default.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
}
function generateRefreshToken(payloadId) {
    return jsonwebtoken_1.default.sign({ id: payloadId }, jwt_tokens_js_1.default.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
}
function setTokenCookies(res, tokens) {
    res.cookie(jwt_tokens_js_1.default.ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, cookieOptions.accessTokenOption);
    res.cookie(jwt_tokens_js_1.default.REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, cookieOptions.refreshTokenOption);
}
function setJwtTokens(payloadId, res) {
    const tokens = {
        accessToken: generateAccessToken(payloadId),
        refreshToken: generateRefreshToken(payloadId),
    };
    setTokenCookies(res, tokens);
    return tokens;
}
function clearJwtTokenCookies(res) {
    res.clearCookie(jwt_tokens_js_1.default.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(jwt_tokens_js_1.default.REFRESH_TOKEN_COOKIE_NAME);
}
//# sourceMappingURL=token.js.map