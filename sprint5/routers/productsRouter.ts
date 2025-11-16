import express from "express";
import { productController } from "../controllers/productController";
import {
  validateProductCreate,
  validateId,
  validateProductUpdate,
  validateProductQuery,
} from "../middlewares/validate";
import productCommentRouter from "./productCommentsRouter";
import likeRouter from "./productLikeRouter";
import passport from "../lib/passport/index";
import { optionalAuth } from "../middlewares/optionalAuth";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(validateProductQuery, optionalAuth, productController.getProductList)
  .post(
    validateProductCreate,
    passport.authenticate("access-token", { session: false }),
    productController.postProduct
  );

productRouter
  .route("/:id")
  .get(validateId, optionalAuth, productController.getProductById)
  .patch(
    validateId,
    validateProductUpdate,
    passport.authenticate("access-token", { session: false }),
    productController.patchProduct
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    productController.deletProduct
  );

productRouter.use("/:productId/comments", productCommentRouter);
productRouter.use("/:productId/like", likeRouter);

export default productRouter;
