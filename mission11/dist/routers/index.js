"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const articleRouter_1 = __importDefault(require("./articleRouter"));
const productRouter_1 = __importDefault(require("./productRouter"));
const commentRouter_1 = __importDefault(require("./commentRouter"));
const likeRouter_1 = __importDefault(require("./likeRouter"));
const photoRouter_1 = __importDefault(require("./photoRouter"));
const alertRouter_1 = __importDefault(require("./alertRouter"));
const router = express_1.default.Router();
router.use("/users", userRouter_1.default);
router.use("/articles", articleRouter_1.default);
router.use("/products", productRouter_1.default);
router.use("/comments", commentRouter_1.default);
router.use("/likes", likeRouter_1.default);
router.use(photoRouter_1.default);
router.use("/alerts", alertRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map