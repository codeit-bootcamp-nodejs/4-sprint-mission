import express from "express";
import API from "../controllers/users/index.js";
import passports from "../lib/passport/index.js";
const router = express.Router();
const jwt_auth = passports.jwtAccess;
router.post("/register", API.createUser);
router.post("/login", API.loginUser);
router.post("/logout", jwt_auth, API.logoutUser);
router.get("/refresh", passports.jwtRefresh, API.userTokenRefresh);
router.get("/profile", jwt_auth, API.getUserProfile);
router.patch("/profile", jwt_auth, API.updateUserProfile);
router.patch("/password", jwt_auth, API.updateUserChangePassword);
export default router;
//# sourceMappingURL=users.js.map