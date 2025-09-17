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
exports.UserController = void 0;
var prisma_1 = require("../lib/prisma");
var user_service_1 = require("../service/user-service");
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        //회원가입 유효성 검사 필요
        this.register = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, nickname, password, image, newUser, formatUser, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, nickname = _a.nickname, password = _a.password, image = _a.image;
                        return [4 /*yield*/, user_service_1.default.createUser({
                                email: email,
                                nickname: nickname,
                                password: password,
                                image: image
                            })];
                    case 1:
                        newUser = _b.sent();
                        return [4 /*yield*/, user_service_1.default.formatUser(newUser)];
                    case 2:
                        formatUser = _b.sent();
                        return [2 /*return*/, res.send(formatUser)];
                    case 3:
                        error_1 = _b.sent();
                        console.error(error_1);
                        res.send(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.login = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, password, user, accessToken, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, prisma_1.default.user.findUnique({
                                where: { email: email }
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw new Error("no user");
                        }
                        return [4 /*yield*/, user_service_1.default.loginAndGiveToken({ email: email, password: password })];
                    case 2:
                        accessToken = _b.sent();
                        console.log('access token: ', accessToken);
                        res.send(accessToken);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.error(error_2);
                        res.send(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                try {
                    user = req.user;
                    return [2 /*return*/, res.send(user_service_1.default.formatUser(user))];
                }
                catch (error) {
                    console.error(error);
                    return [2 /*return*/, res.send(error)];
                }
                return [2 /*return*/];
            });
        }); };
        this.patchUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, nickname, image, user, userId, patchUser, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, nickname = _a.nickname, image = _a.image;
                        user = req.user;
                        userId = Number(user.id);
                        return [4 /*yield*/, prisma_1.default.user.update({
                                where: { id: userId },
                                data: { nickname: nickname, image: image }
                            })];
                    case 1:
                        patchUser = _b.sent();
                        return [2 /*return*/, res.send(user_service_1.default.formatUser(patchUser))];
                    case 2:
                        error_3 = _b.sent();
                        console.error(error_3);
                        return [2 /*return*/, res.send(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.patchPassword = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var password, user, userId, patchUser, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        password = req.body.password;
                        user = req.user;
                        userId = Number(user.id);
                        return [4 /*yield*/, prisma_1.default.user.update({
                                where: { id: userId },
                                data: { password: password }
                            })];
                    case 1:
                        patchUser = _a.sent();
                        return [2 /*return*/, res.send(user_service_1.default.formatUser(patchUser))];
                    case 2:
                        error_4 = _a.sent();
                        console.error(error_4);
                        return [2 /*return*/, res.send(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getUserProduct = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId, user, userProduct;
            return __generator(this, function (_a) {
                userId = Number(req.params.userId);
                try {
                    user = prisma_1.default.user.findUnique({
                        where: { id: userId },
                        include: { product: true }
                    });
                    userProduct = user.product;
                    return [2 /*return*/, res.send(userProduct)];
                }
                catch (error) {
                    console.error(error);
                    return [2 /*return*/, res.send(error)];
                }
                return [2 /*return*/];
            });
        }); };
        this.getLikedProduct = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, likedModels, likedProducList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user;
                        likedModels = user.productLike;
                        return [4 /*yield*/, user_service_1.default.likedProduct(likedModels)];
                    case 1:
                        likedProducList = _a.sent();
                        return [2 /*return*/, res.send(likedProducList)];
                }
            });
        }); };
    }
    return UserController;
}());
exports.UserController = UserController;
exports.default = new UserController();
