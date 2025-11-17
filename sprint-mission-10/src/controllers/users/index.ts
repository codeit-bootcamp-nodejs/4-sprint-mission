import createUser from "./post.user.register.js";
import loginUser from "./post.user.login.js";
import logoutUser from "./post.user.logout.js";
import getUserProfile from "./get.user.profile.js";
import updateUserProfile from "./update.user.profile.js";
import updateUserChangePassword from "./update.user.change.password.js";
import userTokenRefresh from "./get.user.token.refresh.js";
import getUserNotifications from "./get.user.notifications.js";
import getUserNotReads from "./get.user.not-reads.js";
import updateUserNotification from "./update.user.notification.js";

const userAPI = {
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserChangePassword,
  userTokenRefresh,
  getUserNotifications,
  getUserNotReads,
  updateUserNotification,
};

export default userAPI;
