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
exports.ProductController = void 0;
var product_service_1 = require("../service/product-service");
var prisma_1 = require("../lib/prisma");
var ProductController = /** @class */ (function () {
    function ProductController() {
        var _this = this;
        this.getProducts = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, sort, _c, skip, _d, take, searchName, searchDescription, data, user, products, _i, products_1, product, error_1, err;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = req.query, _b = _a.sort, sort = _b === void 0 ? 'recent' : _b, _c = _a.skip, skip = _c === void 0 ? 0 : _c, _d = _a.take, take = _d === void 0 ? 10 : _d, searchName = _a.searchName, searchDescription = _a.searchDescription;
                        data = { sort: sort, skip: skip, take: take, searchName: searchName, searchDescription: searchDescription };
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 7, , 8]);
                        user = req.user;
                        return [4 /*yield*/, product_service_1.default.getProducts(data)];
                    case 2:
                        products = _e.sent();
                        _i = 0, products_1 = products;
                        _e.label = 3;
                    case 3:
                        if (!(_i < products_1.length)) return [3 /*break*/, 6];
                        product = products_1[_i];
                        return [4 /*yield*/, product_service_1.default.addIsLiked(user, product)];
                    case 4:
                        product = _e.sent();
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, res.status(200).send(products)];
                    case 7:
                        error_1 = _e.sent();
                        console.error(error_1);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.getOneProduct = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, user, product, error_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        user = req.user;
                        return [4 /*yield*/, prisma_1.default.product.findUnique({
                                where: { id: id },
                                include: { comment: true }
                            })];
                    case 2:
                        product = _a.sent();
                        return [4 /*yield*/, product_service_1.default.addIsLiked(user, product)];
                    case 3:
                        product = _a.sent();
                        return [2 /*return*/, res.status(200).send(product)];
                    case 4:
                        error_2 = _a.sent();
                        console.error(error_2);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.postProduct = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, description, price, tags, user, userId, Product, error_3, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, description = _a.description, price = _a.price, tags = _a.tags;
                        user = req.user;
                        if (!user) {
                            throw Error("no user");
                        }
                        userId = user.id;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma_1.default.product.create({
                                data: {
                                    name: name,
                                    description: description,
                                    price: price,
                                    tags: tags,
                                    user: { connect: { id: userId } }
                                }
                            })];
                    case 2:
                        Product = _b.sent();
                        console.log("post success");
                        return [2 /*return*/, res.status(201).send(Product)];
                    case 3:
                        error_3 = _b.sent();
                        console.log('post product failed because of server error');
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.patchProduct = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, description, price, tags, id, product, error_4, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, description = _a.description, price = _a.price, tags = _a.tags;
                        id = Number(req.params.id);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma_1.default.product.update({
                                where: { id: id },
                                data: {
                                    name: name,
                                    description: description,
                                    price: price,
                                    tags: tags
                                }
                            })];
                    case 2:
                        product = _b.sent();
                        console.log("patch success");
                        return [2 /*return*/, res.status(200).send(product)];
                    case 3:
                        error_4 = _b.sent();
                        console.log('patch product failed because of server error');
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.deleteProduct = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, error_5, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma_1.default.product.delete({
                                where: { id: id }
                            })];
                    case 2:
                        _a.sent();
                        console.log("deleting success");
                        return [2 /*return*/, res.status(204).send("deleting successed")];
                    case 3:
                        error_5 = _a.sent();
                        console.log('deleting product failed because of server error');
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getComments = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, take, _c, skip, _d, commentId, comments, error_6, err;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.take, take = _b === void 0 ? 10 : _b, _c = _a.skip, skip = _c === void 0 ? 1 : _c, _d = _a.commentId, commentId = _d === void 0 ? 1 : _d;
                        take = Number(take);
                        skip = Number(skip);
                        commentId = Number(commentId);
                        return [4 /*yield*/, prisma_1.default.productComment.findMany({
                                take: take,
                                skip: skip,
                                cursor: { id: commentId },
                                orderBy: { id: 'asc' }
                            })];
                    case 1:
                        comments = _e.sent();
                        if (!comments) {
                            return [2 /*return*/, res.status(300).send("There isn't comment. Write the first comment!")];
                        }
                        return [2 /*return*/, res.status(200).send(comments)];
                    case 2:
                        error_6 = _e.sent();
                        console.error(error_6);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.postComment = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, user, commentContent, err, newComment, error_7, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        user = req.user;
                        if (!user) {
                            throw Error("no user");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        commentContent = req.body.commentContent;
                        if (!commentContent || commentContent.length > 1000) {
                            err = new Error("invalid body data");
                            // err.status = 400;
                            return [2 /*return*/, next(err)];
                        }
                        return [4 /*yield*/, prisma_1.default.productComment.create({
                                data: {
                                    commentContent: commentContent,
                                    product: { connect: { id: id } },
                                    user: { connect: { id: user.id } }
                                }
                            })];
                    case 2:
                        newComment = _a.sent();
                        res.status(201).send(newComment);
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.patchComment = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, commentId, commentContent, newComment, error_8, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        commentId = Number(req.params.commentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        commentContent = req.body.commentContent;
                        return [4 /*yield*/, prisma_1.default.productComment.update({
                                where: { id: commentId },
                                data: { commentContent: commentContent }
                            })];
                    case 2:
                        newComment = _a.sent();
                        return [2 /*return*/, res.status(200).send(newComment)];
                    case 3:
                        error_8 = _a.sent();
                        console.error(error_8);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.deleteComment = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, commentId, error_9, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        commentId = Number(req.params.commentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma_1.default.productComment.delete({
                                where: { id: commentId }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(204).send("delete success")];
                    case 3:
                        error_9 = _a.sent();
                        console.error(error_9);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    return ProductController;
}());
exports.ProductController = ProductController;
exports.default = new ProductController();
