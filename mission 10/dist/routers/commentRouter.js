"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
const controller = new commentController_1.CommentController();
router.post("/products/:id", passport_1.default.authenticate("access-token", { session: false }), controller.createProductComment);
router.post("/articles/:id", passport_1.default.authenticate("access-token", { session: false }), controller.createArticleComment);
router.patch("/:id", passport_1.default.authenticate("access-token", { session: false }), controller.modifyComment);
router.delete("/:id", passport_1.default.authenticate("access-token", { session: false }), controller.deleteComment);
router.get("/products/:id", controller.productCommentList);
router.get("/articles/:id", controller.articleCommentList);
exports.default = router;
//# sourceMappingURL=commentRouter.js.map