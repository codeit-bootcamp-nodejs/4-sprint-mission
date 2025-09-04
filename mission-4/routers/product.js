import express from "express";
import commentRouter from "./comment.js";
import parentIdParser from "../middlewares/parnetIdParser.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ProductController from "../controllers/productController.js";
import productValidator from "../middlewares/validation.middleware/productValidator.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorizaion.js";

const productRouter = express.Router();

productRouter.use("/:id/comment", parentIdParser, commentRouter);

// prettier-ignore
productRouter.route("/")
  .get(productValidator(), asyncHandler(ProductController.getProductList))
  .post(authentication(), productValidator(), asyncHandler(ProductController.postProduct));

// prettier-ignore
productRouter.route("/:id")
  .get(productValidator(), asyncHandler(ProductController.getProduct))
  .patch(authentication(), productValidator(), authorization('product'), asyncHandler(ProductController.patchProduct))
  .delete(authentication(), productValidator(), authorization('product'), asyncHandler(ProductController.deleteProduct));

export default productRouter;
