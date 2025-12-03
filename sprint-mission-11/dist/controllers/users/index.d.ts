import createUser from "./post.user.register.js";
import loginUser from "./post.user.login.js";
import logoutUser from "./post.user.logout.js";
import getUserProfile from "./get.user.profile.js";
import updateUserChangePassword from "./update.user.change.password.js";
import userTokenRefresh from "./get.user.token.refresh.js";
import getUserNotifications from "./get.user.notifications.js";
import getUserNotReads from "./get.user.not-reads.js";
import updateUserNotification from "./update.user.notification.js";
declare const userAPI: {
    createUser: typeof createUser;
    loginUser: typeof loginUser;
    logoutUser: typeof logoutUser;
    getUserProfile: typeof getUserProfile;
    updateUserProfile: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    updateUserChangePassword: typeof updateUserChangePassword;
    userTokenRefresh: typeof userTokenRefresh;
    getUserNotifications: typeof getUserNotifications;
    getUserNotReads: typeof getUserNotReads;
    updateUserNotification: typeof updateUserNotification;
};
export default userAPI;
//# sourceMappingURL=index.d.ts.map