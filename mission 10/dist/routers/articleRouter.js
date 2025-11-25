"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const articleController_1 = require("../controllers/articleController");
const router = express_1.default.Router();
const controller = new articleController_1.ArticleController();
router.post("/", passport_1.default.authenticate("access-token", { session: false }), controller.create);
router.patch("/:id", passport_1.default.authenticate("access-token", { session: false }), controller.update);
router.delete("/:id", passport_1.default.authenticate("access-token", { session: false }), controller.delete);
router.get("/", controller.list);
router.get("/:id", controller.detail);
exports.default = router;
//# sourceMappingURL=articleRouter.js.map