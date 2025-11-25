"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const alertController_1 = require("../controllers/alertController");
const router = express_1.default.Router();
const controller = new alertController_1.AlertController();
router.get("/", passport_1.default.authenticate("access-token", { session: false }), controller.list);
router.patch("/:id/read", passport_1.default.authenticate("access-token", { session: false }), controller.markAsRead);
exports.default = router;
//# sourceMappingURL=alertRouter.js.map