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
const articleValidation = __importStar(require("../schemas/article"));
const commentValidation = __importStar(require("../schemas/comment"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const index_1 = __importDefault(require("../controllers/articles/index"));
const index_2 = __importDefault(require("../lib/passport/index"));
const router = express_1.default.Router();
const auth = index_2.default.jwtAccess;
router.post("/", auth, articleValidation.create, multer_1.default.single("Image"), index_1.default.createArticle);
router.post("/comments/:id", auth, commentValidation.create, index_1.default.createArticleComment);
router.get("/detail/:id", index_1.default.getArticleDetail);
router.get("/list", index_1.default.getArticleList);
router.get("/comments/:id", index_1.default.getArticleComment);
router.patch("/:id", auth, articleValidation.update, index_1.default.updateArticle);
router.patch("/comments/:id", auth, commentValidation.create, index_1.default.updateArticleComment);
router.delete("/:id", auth, index_1.default.deleteArticle);
router.delete("/comments/:id", auth, index_1.default.deleteArticleComment);
exports.default = router;
//# sourceMappingURL=article.js.map