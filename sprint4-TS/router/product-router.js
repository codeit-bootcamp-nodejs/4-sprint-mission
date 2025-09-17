"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var like_controller_js_1 = require("../controller/like-controller.js");
var product_controller_js_1 = require("../controller/product-controller.js");
var product_middleware_js_1 = require("../middleware/product-middleware.js");
var auth_middleware_js_1 = require("../middleware/auth-middleware.js");
var passport_1 = require("passport");
var ProductRouter = express_1.default.Router();
//Product API 라우팅
ProductRouter.get('/', product_controller_js_1.default.getProducts);
ProductRouter.get('/detail/:id', product_middleware_js_1.default.validateId, product_controller_js_1.default.getOneProduct);
ProductRouter.post('/', 
// ProductValid, 
product_middleware_js_1.default.validateId, product_middleware_js_1.default.validateForm, passport_1.default.authenticate('AccessToken', { session: false }), product_controller_js_1.default.postProduct);
ProductRouter.patch('/detail/:id', product_middleware_js_1.default.validateId, passport_1.default.authenticate('AccessToken', { session: false }), auth_middleware_js_1.checkProductAuthorize, product_controller_js_1.default.patchProduct);
ProductRouter.delete('/detail/:id', product_middleware_js_1.default.validateId, passport_1.default.authenticate('AccessToken', { session: false }), auth_middleware_js_1.checkProductAuthorize, product_controller_js_1.default.deleteProduct);
//like feature
ProductRouter.post('detail/:id', product_middleware_js_1.default.validateId, passport_1.default.authenticate('AccessToken', { session: false }), like_controller_js_1.default.ProductLike);
ProductRouter.delete('detail/:id', product_middleware_js_1.default.validateId, passport_1.default.authenticate('AccessToken', { session: false }), like_controller_js_1.default.ProductDislike);
//Product Comment API 라우팅
ProductRouter.get('/comments', product_controller_js_1.default.getComments);
ProductRouter.post('/detail/:id/comment', product_middleware_js_1.default.validateId, passport_1.default.authenticate('AccessToken', { session: false }), product_controller_js_1.default.postComment);
ProductRouter.patch('/detail/:id/comment/:commentId', product_middleware_js_1.default.validateId, product_middleware_js_1.default.validateCommentId, passport_1.default.authenticate('AccessToken', { session: false }), auth_middleware_js_1.checkProductCommentAuth, product_controller_js_1.default.patchComment);
ProductRouter.delete('/detail/:id/comment/:commentId', product_middleware_js_1.default.validateId, product_middleware_js_1.default.validateCommentId, passport_1.default.authenticate('AccessToken', { session: false }), auth_middleware_js_1.checkProductCommentAuth, product_controller_js_1.default.deleteComment);
exports.default = ProductRouter;
