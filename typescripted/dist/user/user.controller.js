"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
//  respoonse
const userService = new user_service_1.UserService();
class UserController {
    async getUserInfoCont(req, res, next) {
        try {
            const userId = Number(req.params.id);
            const userInfo = await userService.getUserInfo({ id: userId });
            return res.json({ success: true, data: userInfo });
        }
        catch (error) {
            next(error);
        }
    }
    async patchUserCont(req, res, next) {
        try {
            const userId = Number(req.params.id);
            const { email, nickname } = req.body;
            const modifiedUser = await userService.patchUserInfo(userId, {
                email,
                nickname,
            });
            return res.json({ success: true, data: modifiedUser });
        }
        catch (error) {
            next(error);
        }
    }
    async patchUserPassword(req, res, next) {
        try {
            console.log("요청 들어옴");
            const userId = Number(req.params.id);
            const { currentPassword, newPassword } = req.body;
            console.log("요청 인덱스:", userId);
            console.log(req.body);
            const changedPassword = await userService.patchedPassword(userId, {
                currentPassword,
                newPassword,
            });
            return res.json({ success: true, data: changedPassword });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
