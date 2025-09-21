"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UploadController_1 = __importDefault(require("../controllers/UploadController"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
//uploads 디렉토리가 없을 때 생성
const uploadDir = 'uploads/';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const uploadController = new UploadController_1.default();
//image api
router.post('/upload', upload.single('image'), uploadController.uploadImage);
exports.default = router;
