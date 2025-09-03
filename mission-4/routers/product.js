import express from "express";
import commentRouter from "./comment.js";
import parentIdParser from "../middlewares/parnetIdParser.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ProductController from "../controllers/productController.js";
import productValidator from "../middlewares/productValidator.js";

const productRouter = express.Router();

productRouter.use("/:id/comment", parentIdParser, commentRouter);

// prettier-ignore
productRouter.route("/")
  .get(productValidator(), asyncHandler(ProductController.getProductList))
  .post(productValidator(), asyncHandler(ProductController.postProduct));

// prettier-ignore
productRouter.route("/:id")
  .get(productValidator(), asyncHandler(ProductController.getProduct))
  .patch(productValidator(), asyncHandler(ProductController.patchProduct))
  .delete(productValidator(), asyncHandler(ProductController.deleteProduct));

export default productRouter;
