"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_js_1 = require("../lib/aws.js");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../image/");
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_js_1.s3,
        bucket: "codeit-practice-s3",
        acl: "public-read",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const date = Date.now();
            const filename = `${date}_${file.originalname}`;
            cb(null, `uploads/${filename}`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
});
exports.default = upload;
//# sourceMappingURL=multer.js.map