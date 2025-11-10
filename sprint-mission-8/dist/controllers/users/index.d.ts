import createUser from "./post.user.register.js";
import loginUser from "./post.user.login.js";
import logoutUser from "./post.user.logout.js";
import getUserProfile from "./get.user.profile.js";
import updateUserChangePassword from "./update.user.change.password.js";
import userTokenRefresh from "./get.user.token.refresh.js";
declare const userAPI: {
    createUser: typeof createUser;
    loginUser: typeof loginUser;
    logoutUser: typeof logoutUser;
    getUserProfile: typeof getUserProfile;
    updateUserProfile: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    updateUserChangePassword: typeof updateUserChangePassword;
    userTokenRefresh: typeof userTokenRefresh;
};
export default userAPI;
//# sourceMappingURL=index.d.ts.map