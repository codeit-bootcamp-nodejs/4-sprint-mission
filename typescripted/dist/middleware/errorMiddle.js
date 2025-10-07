"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("../lib/error"));
const zod_1 = require("zod");
function error_handler(error, req, res, next) {
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({ success: false, errors: error.issues });
    }
    if (error instanceof error_1.default) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    const status = error.status || 500;
    const message = error.message || "INTERNAL SERVER ERROR";
    return res.status(status).json({ success: false, message: message });
}
exports.default = error_handler;
