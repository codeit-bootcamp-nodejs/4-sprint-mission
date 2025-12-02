"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_COOKIE_NAME = exports.ACCESS_TOKEN_COOKIE_NAME = exports.JWT_REFRESH_TOKEN_SECRET = exports.JWT_ACCESS_TOKEN_SECRET = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const NODE_ENV = process.env.NODE_ENV || 'development';
exports.NODE_ENV = NODE_ENV;
const PORT = process.env.PORT || 3000;
exports.PORT = PORT;
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_access_token_secret';
exports.JWT_ACCESS_TOKEN_SECRET = JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'your_jwt_refresh_token_secret';
exports.JWT_REFRESH_TOKEN_SECRET = JWT_REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
exports.ACCESS_TOKEN_COOKIE_NAME = ACCESS_TOKEN_COOKIE_NAME;
const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
exports.REFRESH_TOKEN_COOKIE_NAME = REFRESH_TOKEN_COOKIE_NAME;
//# sourceMappingURL=constants.js.map