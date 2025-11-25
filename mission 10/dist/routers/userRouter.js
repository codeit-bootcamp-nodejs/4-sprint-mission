"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const controller = new userController_1.UserController();
router.post("/register", controller.register);
router.post("/login", (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        req.user = user;
        next();
    })(req, res, next);
}, controller.login);
router.get("/profile", passport_1.default.authenticate("access-token", { session: false }), controller.profile);
router.patch("/modifyInformation", passport_1.default.authenticate("access-token", { session: false }), controller.modifyInformation);
router.patch("/modifyPassword", passport_1.default.authenticate("access-token", { session: false }), controller.modifyPassword);
router.get("/products", passport_1.default.authenticate("access-token", { session: false }), controller.products);
router.post("/refresh", passport_1.default.authenticate("refresh-token", { session: false }), controller.refreshTokens);
router.post("/logout", controller.logout);
exports.default = router;
//# sourceMappingURL=userRouter.js.map