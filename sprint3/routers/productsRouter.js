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

const productRouter = express.Router();

productRouter
  .route("/")
  .get(validateProductQuery, getProductList)
  .post(validateProductCreate, postProduct);

productRouter
  .route("/:id")
  .get(validateId, getProductById)
  .patch(validateId, validateProductUpdate, patchProduct)
  .delete(validateId, deletProduct);

productRouter.use("/:productId/comments", productCommentRouter);

export default productRouter;
