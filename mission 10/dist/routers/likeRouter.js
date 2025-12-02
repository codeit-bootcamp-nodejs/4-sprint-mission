"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const likeController_1 = require("../controllers/likeController");
const router = express_1.default.Router();
const controller = new likeController_1.LikeController();
router.post("/articles/:id", passport_1.default.authenticate("access-token", { session: false }), controller.likeArticle);
router.post("/products/:id", passport_1.default.authenticate("access-token", { session: false }), controller.likeProduct);
router.get("/articles", passport_1.default.authenticate("access-token", { session: false }), controller.getLikedArticles);
router.get("/products", passport_1.default.authenticate("access-token", { session: false }), controller.getLikedProducts);
exports.default = router;
//# sourceMappingURL=likeRouter.js.map