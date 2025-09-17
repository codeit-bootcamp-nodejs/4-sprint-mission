"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var article_router_js_1 = require("./router/article-router.js");
var product_router_js_1 = require("./router/product-router.js");
var user_router_js_1 = require("./router/user-router.js");
var file_js_1 = require("./file.js");
var cookie_parser_1 = require("cookie-parser");
var cors_1 = require("cors");
var express_1 = require("express");
require("dotenv/config");
var passport_1 = require("passport");
var passport_lib_js_1 = require("./lib/passport-lib.js");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
passport_1.default.use('AccessToken', passport_lib_js_1.accessJwtStrategy);
passport_1.default.use('RefreshToken', passport_lib_js_1.refreshJwtStrategy);
app.use('/user', user_router_js_1.default);
app.use('/article', article_router_js_1.default);
app.use('/product', product_router_js_1.default);
app.use('/upload', file_js_1.default);
app.use(function (err, req, res, next) {
    if (err) {
        res.json(err.message || "Server Error Occured");
    }
});
app.listen(3000, function () {
    console.log("server is running at http://localhost:3000");
});
