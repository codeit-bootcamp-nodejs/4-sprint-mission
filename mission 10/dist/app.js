"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./routers/index"));
const index_2 = __importDefault(require("./lib/passport/index"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middlewares/errorHandler");
const http_1 = __importDefault(require("http"));
const io_1 = require("./socket/io"); // ⬅ io 초기화 함수만 import
const socket_1 = require("./socket/socket"); // ⬅ 소켓 이벤트 등록
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(index_2.default.initialize());
app.use(index_1.default);
app.use(errorHandler_1.errorHandler);
const server = http_1.default.createServer(app);
exports.server = server;
(0, io_1.initIo)(server);
(0, socket_1.registerSocket)();
exports.default = app;
//# sourceMappingURL=app.js.map