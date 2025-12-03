"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_js_1 = __importDefault(require("../controllers/users/index.js"));
const index_js_2 = __importDefault(require("../lib/passport/index.js"));
const router = express_1.default.Router();
const jwt_auth = index_js_2.default.jwtAccess;
router.post("/register", index_js_1.default.createUser);
router.post("/login", index_js_1.default.loginUser);
router.post("/logout", jwt_auth, index_js_1.default.logoutUser);
router.get("/refresh", index_js_2.default.jwtRefresh, index_js_1.default.userTokenRefresh);
router.get("/profile", jwt_auth, index_js_1.default.getUserProfile);
router.get("/notifications", jwt_auth, index_js_1.default.getUserNotifications);
router.get("/notreads", jwt_auth, index_js_1.default.getUserNotReads);
router.patch("/profile", jwt_auth, index_js_1.default.updateUserProfile);
router.patch("/password", jwt_auth, index_js_1.default.updateUserChangePassword);
router.patch("/notifications", jwt_auth, index_js_1.default.updateUserNotification);
exports.default = router;
//# sourceMappingURL=users.js.map