"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const localStrategy_1 = require("./localStrategy");
const jwtStrategy_1 = require("./jwtStrategy");
passport_1.default.use('local', localStrategy_1.localStrategy);
passport_1.default.use('access-token', jwtStrategy_1.accessTokenStrategy);
passport_1.default.use('refresh-token', jwtStrategy_1.refreshTokenStrategy);
exports.default = passport_1.default;
//# sourceMappingURL=index.js.map