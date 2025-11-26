"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const photoController_1 = require("../controllers/photoController");
const s3_1 = require("../lib/s3");
const router = express_1.default.Router();
const controller = new photoController_1.PhotoController();
router.post("/", passport_1.default.authenticate("access-token", { session: false }), s3_1.uploadS3.single("image"), controller.upload);
exports.default = router;
//# sourceMappingURL=photoRouter.js.map