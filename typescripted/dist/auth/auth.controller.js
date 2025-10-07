"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async createUserCont(req, res, next) {
        try {
            const { nickname, password, email } = req.body;
            const newUser = await authService.createUser({ nickname, password, email });
            return res.json({ success: true, data: newUser });
        }
        catch (error) {
            next(error);
        }
    }
    async loginUserCont(req, res, next) {
        try {
            const { nickname, password, email } = req.body;
            const login = await authService.loginUser({ nickname, password, email });
            next(login);
            return res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
