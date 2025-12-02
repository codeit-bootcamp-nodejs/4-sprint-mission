import express from "express";
import passport from "../lib/passport";
import { UserController } from "../controllers/userController";

const router = express.Router();
const controller = new UserController();

router.post("/register", controller.register);
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate(
      "local",
      { session: false },
      (
        err: any,
        user: Express.User | false,
        info: { message?: string } | undefined
      ) => {
        if (err) return next(err);

        if (!user) {
          return res.status(401).json({
            message: "Unauthorized", 
          });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  },
  controller.login
);

router.get(
  "/profile",
  passport.authenticate("access-token", { session: false }),
  controller.profile
);
router.patch(
  "/modifyInformation",
  passport.authenticate("access-token", { session: false }),
  controller.modifyInformation
);
router.patch(
  "/modifyPassword",
  passport.authenticate("access-token", { session: false }),
  controller.modifyPassword
);
router.get(
  "/products",
  passport.authenticate("access-token", { session: false }),
  controller.products
);
router.post(
  "/refresh",
  passport.authenticate("refresh-token", { session: false }),
  controller.refreshTokens
);
router.delete(
  "/delete",
  passport.authenticate("access-token", { session: false}),
  controller.deleteUser
);
router.post("/logout", controller.logout);

export default router;
