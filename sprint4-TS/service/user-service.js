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
var bcrypt_1 = require("bcrypt");
var prisma_js_1 = require("../lib/prisma.js");
var json_web_token_js_1 = require("../lib/json-web-token.js");
var userService = /** @class */ (function () {
    function userService() {
        var _this = this;
        this.createUser = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var salt, hashedPassword, data, newUser, error_1;
            var password = _b.password, email = _b.email, nickname = _b.nickname, image = _b.image;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
                    case 1:
                        salt = _c.sent();
                        password = String(password);
                        return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
                    case 2:
                        hashedPassword = _c.sent();
                        data = {
                            password: hashedPassword,
                            email: email,
                            nickname: nickname,
                            image: image
                        };
                        return [4 /*yield*/, prisma_js_1.default.user.create({ data: data })];
                    case 3:
                        newUser = _c.sent();
                        return [2 /*return*/, newUser];
                    case 4:
                        error_1 = _c.sent();
                        console.error(error_1);
                        throw new Error(error_1.message);
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.loginAndGiveToken = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var user, accessToken, isMatch;
            var email = _b.email, password = _b.password;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, prisma_js_1.default.user.findUnique({
                            where: { email: email }
                        })];
                    case 1:
                        user = _c.sent();
                        if (!user) return [3 /*break*/, 6];
                        accessToken = void 0;
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 2:
                        isMatch = _c.sent();
                        if (!isMatch) return [3 /*break*/, 4];
                        return [4 /*yield*/, json_web_token_js_1.default.generateAccess(user)];
                    case 3:
                        accessToken = _c.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new Error("check Id and Password again");
                    case 5:
                        console.log("at user-service, accees: ", accessToken);
                        return [2 /*return*/, accessToken];
                    case 6: throw new Error("no user");
                }
            });
        }); };
        /*
         input: 현재 로그인한 유저의
                product, user의 좋아요 관계인
                like 모델들의 모임
         output: 유저가 좋아요 한 product들을 list 형식으로 가져옵니다.
         */
        this.likedProduct = function (likeModels) { return __awaiter(_this, void 0, void 0, function () {
            var likedProducList, _i, likeModels_1, likedModel, productId, Product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        likedProducList = [];
                        _i = 0, likeModels_1 = likeModels;
                        _a.label = 1;
                    case 1:
                        if (!(_i < likeModels_1.length)) return [3 /*break*/, 4];
                        likedModel = likeModels_1[_i];
                        productId = likedModel.productId;
                        return [4 /*yield*/, prisma_js_1.default.product.findFirst({
                                id: productId
                            })];
                    case 2:
                        Product = _a.sent();
                        likedProducList.push(product);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, likedProducList];
                }
            });
        }); };
        this.formatUser = function (user) { return __awaiter(_this, void 0, void 0, function () {
            var formattedUser;
            return __generator(this, function (_a) {
                formattedUser = {};
                formattedUser.email = user.email;
                formattedUser.nickname = user.nickname;
                formattedUser.image = user.image;
                formattedUser.createdAt = user.createdAt;
                formattedUser.updatedAt = user.updatedAt;
                return [2 /*return*/, formattedUser];
            });
        }); };
    }
    return userService;
}());
exports.default = new userService();
