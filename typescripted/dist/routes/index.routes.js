"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_routes_1 = __importDefault(require("../product/product.routes"));
const article_routes_1 = __importDefault(require("../article/article.routes"));
const user_routes_1 = __importDefault(require("../user/user.routes"));
const comment_routes_1 = __importDefault(require("../comment/comment.routes"));
const router = express_1.default.Router();
router.use("/product", product_routes_1.default);
router.use("/article", article_routes_1.default);
router.use("/comment", comment_routes_1.default);
router.use("/user", user_routes_1.default);
exports.default = router;
