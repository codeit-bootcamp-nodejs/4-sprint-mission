import express from "express";
import {
  deletProduct,
  getProductById,
  getProductList,
  patchProduct,
  postProduct,
} from "../controllers/productController.js";
import {
  validateProductCreate,
  validateId,
  validateProductUpdate,
  validateProductQuery,
} from "../middlewares/validate.js";
import productCommentRouter from "./productCommentsRouter.js";
import likeRouter from "./productLikeRouter.js";
import passport from "../lib/passport/index.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(validateProductQuery, optionalAuth, getProductList)
  .post(
    validateProductCreate,
    passport.authenticate("access-token", { session: false }),
    postProduct
  );

productRouter
  .route("/:id")
  .get(validateId, optionalAuth, getProductById)
  .patch(
    validateId,
    validateProductUpdate,
    passport.authenticate("access-token", { session: false }),
    patchProduct
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    deletProduct
  );

productRouter.use("/:productId/comments", productCommentRouter);
productRouter.use("/:productId/like", likeRouter);

export default productRouter;
