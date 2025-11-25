"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const http_status_1 = __importDefault(require("http-status"));
function errorHandler(err, req, res, next) {
    if (err instanceof zod_1.z.ZodError) {
        return res.status(http_status_1.default.BAD_REQUEST).json({ error: err.issues });
    }
    if (err.code === "P2025") {
        return res.status(http_status_1.default.NOT_FOUND).json({ error: "Record not found" });
    }
    console.error("unhandled Error:", err);
    return res
        .status(http_status_1.default.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
}
//# sourceMappingURL=errorHandler.js.map