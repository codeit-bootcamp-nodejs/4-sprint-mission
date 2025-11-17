"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_product_js_1 = __importDefault(require("./delete.product.js"));
const delete_product_comment_js_1 = __importDefault(require("./delete.product.comment.js"));
const get_product_comments_js_1 = __importDefault(require("./get.product.comments.js"));
const get_product_detail_js_1 = __importDefault(require("./get.product.detail.js"));
const get_product_list_js_1 = __importDefault(require("./get.product.list.js"));
const post_product_comment_create_js_1 = __importDefault(require("./post.product.comment.create.js"));
const post_product_create_js_1 = __importDefault(require("./post.product.create.js"));
const update_product_js_1 = __importDefault(require("./update.product.js"));
const update_product_comment_js_1 = __importDefault(require("./update.product.comment.js"));
const post_product_like_js_1 = __importDefault(require("./post.product.like.js"));
const get_like_products_js_1 = __importDefault(require("./get.like.products.js"));
const productAPI = {
    createProduct: post_product_create_js_1.default,
    createProductComment: post_product_comment_create_js_1.default,
    getProductComments: get_product_comments_js_1.default,
    getProductDetail: get_product_detail_js_1.default,
    getProductList: get_product_list_js_1.default,
    updateProduct: update_product_js_1.default,
    updateProductComment: update_product_comment_js_1.default,
    deleteProduct: delete_product_js_1.default,
    deleteProductComment: delete_product_comment_js_1.default,
    ProductLike: post_product_like_js_1.default,
    getLikeProducts: get_like_products_js_1.default,
};
Object.freeze(productAPI);
exports.default = productAPI;
//# sourceMappingURL=index.js.map