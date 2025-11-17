"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddle_1 = __importDefault(require("./middleware/errorMiddle"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send("Hello World");
});
// API 라우터
app.use("/api", index_routes_1.default);
app.use(errorMiddle_1.default);
app.listen(3000, () => {
    console.log('Server running on port 3000!');
});
