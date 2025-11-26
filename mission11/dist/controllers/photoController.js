"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoController = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const http_status_1 = __importDefault(require("http-status"));
class PhotoController {
    async upload(req, res, next) {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (!req.file) {
            return res.status(http_status_1.default.BAD_REQUEST).json({ message: "No file uploaded" });
        }
        try {
            const imageUrl = req.file.location;
            const updatedUser = await prisma_1.default.user.update({
                where: { id: req.user.id },
                data: { image: imageUrl },
            });
            res.status(http_status_1.default.OK).json({
                message: "Photo uploaded successfully",
                image: updatedUser.image,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.PhotoController = PhotoController;
//# sourceMappingURL=photoController.js.map