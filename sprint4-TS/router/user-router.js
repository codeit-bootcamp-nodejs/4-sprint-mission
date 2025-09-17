"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controller/user-controller");
var passport_1 = require("passport");
var auth_middleware_1 = require("../middleware/auth-middleware");
var userRouter = express_1.default.Router();
// register, login, get login user information
userRouter.post('/login', user_controller_1.default.login);
userRouter.post('/register', user_controller_1.default.register);
userRouter.get('/:id', passport_1.default.authenticate('AccessToken', { session: false }), user_controller_1.default.getUser);
//modify user information
userRouter.patch('/:id', passport_1.default.authenticate('AccessToken', { session: false }), user_controller_1.default.patchUser);
userRouter.patch('/:id', passport_1.default.authenticate('AccessToken', { session: false }), user_controller_1.default.patchPassword);
//get products of login user
userRouter.get('/:id/products', passport_1.default.authenticate("Access Token", { session: false }), auth_middleware_1.checkUserAuth, user_controller_1.default.getUserProduct);
//get liked products of login user
userRouter.get(':id/like', passport_1.default.authenticate('AccessToken', { session: false }));
//refresh token
userRouter.post('auth/refresh', passport_1.default.authenticate('RefreshToken', { session: false }));
// passport.authenticate('local'),
// passport.authenticate('jwt')
exports.default = userRouter;
