import express from "express";
import { authMiddleware } from "../middleware/index.js";
import { UserController } from "../controller/user-controller.js";

const userRouter = (userController: UserController) => {
  const router = express.Router();

  router.post("/signup", userController.signUp);
  router.post("/signin", userController.signIn);
  router.post("/token/refresh", userController.refresh);
  router.post("/signout", authMiddleware, userController.signOut);

  router
    .route("/me")
    .get(authMiddleware, userController.getMyInfo)
    .patch(authMiddleware, userController.updateMyInfo);

  router.patch("/me/password", authMiddleware, userController.changeMyPassword);
  router.get("/me/products", authMiddleware, userController.getMyProducts);
  router.get(
    "/me/liked-products",
    authMiddleware,
    userController.getLikedProducts
  );
  router.get(
    "/me/liked-articles",
    authMiddleware,
    userController.getLikedArticles
  );

  return router;
};

export default userRouter;
