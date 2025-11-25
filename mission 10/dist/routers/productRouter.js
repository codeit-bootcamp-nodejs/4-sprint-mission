"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
const controller = new productController_1.ProductController();
// ✅ 인증 필요
router.post("/", passport_1.default.authenticate("access-token", { session: false }), controller.create);
router.patch("/:id", passport_1.default.authenticate("access-token", { session: false }), controller.update);
router.delete("/:id", passport_1.default.authenticate("access-token", { session: false }), controller.delete);
// ✅ 인증 필요 X (공개)
router.get("/", controller.list);
router.get("/:id", controller.detail);
exports.default = router;
//# sourceMappingURL=productRouter.js.map