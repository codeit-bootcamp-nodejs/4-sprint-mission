"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uuid_1 = require("uuid");
// AWS.config.update({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });
// const s3 = new AWS.S3({});
exports.uploadS3 = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: new client_s3_1.S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_REGION,
        }),
        bucket: process.env.AWS_S3_BUCKET,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const ext = file.originalname.split(".").pop();
            cb(null, `users/${(0, uuid_1.v4)()}.${ext}`);
        },
    }),
});
//# sourceMappingURL=s3.js.map