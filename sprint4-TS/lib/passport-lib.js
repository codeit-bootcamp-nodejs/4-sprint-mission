"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshJwtStrategy = exports.accessJwtStrategy = void 0;
var passport_1 = require("passport");
var passport_jwt_1 = require("passport-jwt");
var prisma_js_1 = require("./prisma.js");
var constants_js_1 = require("./constants.js");
//request로 부터 token을 받고, 해석하는 부분(options)
var accessJwtOptions = {
    jwtFromRequest: function (req) {
        return req.cookies[constants_js_1.ACCESS_TOKEN_COOKIE_NAME];
    },
    secretOrKey: constants_js_1.ACCESS_SECRET_KEY
};
var refreshJwtOptions = {
    jwtFromRequest: function (req) {
        return req.cookies[constants_js_1.REFRESH_TOKEN_COOKIE_NAME];
    },
    secretOrKey: constants_js_1.REFRESH_SECRET_KEY
};
//passport에서 인증이 이루어지는 부분(verify)
function jwtVerify(payload, done) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = payload.userId;
                    if (!userId) {
                        done(Error, null);
                    }
                    return [4 /*yield*/, prisma_js_1.default.user.findUnique({
                            where: { id: userId }
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        done(Error, null);
                    }
                    done(null, user);
                    return [2 /*return*/];
            }
        });
    });
}
//Access Token을 검증하는 전략 
exports.accessJwtStrategy = new passport_jwt_1.Strategy(accessJwtOptions, function (payload, done) {
    jwtVerify;
});
//Refresh Token을 검증하는 전략 
exports.refreshJwtStrategy = new passport_jwt_1.Strategy(refreshJwtOptions, function (payload, done) {
    jwtVerify;
});
passport_1.default.use('AccessToken', exports.accessJwtStrategy);
passport_1.default.use('RefreshToken', exports.refreshJwtStrategy);
// export const authUserWithParmaId = passport.authenticate("Access Token", (req,res) =>{
//     const paramId = req.params.id;
//     const tokenId = req.user.id
//     if (paramId != tokenId){
//         return res.send("no authorization")
//     }else{
//         return next()
//     }
// })
