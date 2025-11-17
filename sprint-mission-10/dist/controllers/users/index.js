"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_user_register_js_1 = __importDefault(require("./post.user.register.js"));
const post_user_login_js_1 = __importDefault(require("./post.user.login.js"));
const post_user_logout_js_1 = __importDefault(require("./post.user.logout.js"));
const get_user_profile_js_1 = __importDefault(require("./get.user.profile.js"));
const update_user_profile_js_1 = __importDefault(require("./update.user.profile.js"));
const update_user_change_password_js_1 = __importDefault(require("./update.user.change.password.js"));
const get_user_token_refresh_js_1 = __importDefault(require("./get.user.token.refresh.js"));
const get_user_notifications_js_1 = __importDefault(require("./get.user.notifications.js"));
const get_user_not_reads_js_1 = __importDefault(require("./get.user.not-reads.js"));
const update_user_notification_js_1 = __importDefault(require("./update.user.notification.js"));
const userAPI = {
    createUser: post_user_register_js_1.default,
    loginUser: post_user_login_js_1.default,
    logoutUser: post_user_logout_js_1.default,
    getUserProfile: get_user_profile_js_1.default,
    updateUserProfile: update_user_profile_js_1.default,
    updateUserChangePassword: update_user_change_password_js_1.default,
    userTokenRefresh: get_user_token_refresh_js_1.default,
    getUserNotifications: get_user_notifications_js_1.default,
    getUserNotReads: get_user_not_reads_js_1.default,
    updateUserNotification: update_user_notification_js_1.default,
};
exports.default = userAPI;
//# sourceMappingURL=index.js.map