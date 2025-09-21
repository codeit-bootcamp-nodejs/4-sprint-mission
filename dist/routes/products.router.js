"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductsController_1 = __importDefault(require("../controllers/ProductsController"));
const ProductService_1 = __importDefault(require("../ProductService"));
const ProductRepository_1 = __importDefault(require("../repositories/ProductRepository"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const optionalAuth_middleware_1 = __importDefault(require("../middlewares/optionalAuth.middleware"));
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
// Initialize repositories and services
const productRepository = new ProductRepository_1.default();
const productService = new ProductService_1.default(productRepository);
const productsController = new ProductsController_1.default(productService);
// registration router
router.post('/products', auth_middleware_1.default, validation_middleware_1.validateProduct, productsController.createProduct);
// cherck router
router.get('/products', optionalAuth_middleware_1.default, productsController.getProducts);
// datail, modify, delete
router
    .route('/products/:productId')
    .get(optionalAuth_middleware_1.default, productsController.getProductById)
    .patch(validation_middleware_1.validateProduct, auth_middleware_1.default, productsController.updateProduct)
    .delete(auth_middleware_1.default, productsController.deleteProduct);
// comment
router.post('/products/:productId/comments', auth_middleware_1.default, productsController.createComment);
//comment check
router.get('/products/:productId/comments', productsController.getComments);
// comment modify
router.patch('/products/comments/:commentId', auth_middleware_1.default, productsController.updateComment);
// comment delete
router.delete('/products/comments/:commentId', auth_middleware_1.default, productsController.deleteComment);
// 상품 좋아요 API
router.post('/:productId/like', auth_middleware_1.default, productsController.toggleLike);
exports.default = router;
