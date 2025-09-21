"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
// import router
const products_router_1 = __importDefault(require("./routes/products.router"));
const articles_router_1 = __importDefault(require("./routes/articles.router"));
const upload_router_1 = __importDefault(require("./routes/upload.router"));
const users_router_1 = __importDefault(require("./routes/users.router"));
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// route settitng
app.use('/api', [products_router_1.default, articles_router_1.default, upload_router_1.default, users_router_1.default]);
// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || '오류가 발생했습니다.';
    res.status(statusCode).json({ message });
});
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번에서 실행중입니다.`);
});
exports.default = prisma;
