"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productValidation = __importStar(require("../schemas/product"));
const commentValidation = __importStar(require("../schemas/comment"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const index_1 = __importDefault(require("../lib/passport/index"));
const index_2 = __importDefault(require("../controllers/products/index"));
const router = express_1.default.Router();
const auth = index_1.default.jwtAccess;
router.post("/", auth, productValidation.create, multer_1.default.single("Image"), index_2.default.createProduct);
router.post("/comments/:id", auth, commentValidation.create, index_2.default.createProductComment);
router.post("/likes/:id", auth, index_2.default.ProductLike);
router.get("/detail/:id", index_2.default.getProductDetail);
router.get("/list", index_2.default.getProductList);
router.get("/comments/:id", index_2.default.getProductComments);
router.get("/likes", auth, index_2.default.getLikeProducts);
router.patch("/:id", auth, productValidation.update, index_2.default.updateProduct);
router.patch("/comments/:id", auth, commentValidation.create, index_2.default.updateProductComment);
router.delete("/:id", auth, index_2.default.deleteProduct);
router.delete("/comments/:id", auth, index_2.default.deleteProductComment);
exports.default = router;
//# sourceMappingURL=product.js.map