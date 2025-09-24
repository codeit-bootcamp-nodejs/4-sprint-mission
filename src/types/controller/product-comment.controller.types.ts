import type { Controller } from "../controller.js";
import type {
  ProductCommentBodyDto,
  ProductCommentParamsDto,
  ProductCommentQueryDto,
} from "../../dto/request/product-comment.request.dto.js";

export type CreateProductCommentController = Controller<
  ProductCommentParamsDto,
  unknown,
  ProductCommentBodyDto
>;

export type UpdateProductCommentController = Controller<
  ProductCommentParamsDto,
  unknown,
  ProductCommentBodyDto
>;

export type DeleteProductCommentController =
  Controller<ProductCommentParamsDto>;

export type ListProductCommentController = Controller<
  ProductCommentParamsDto,
  unknown,
  unknown,
  ProductCommentQueryDto
>;

export type GetProductCommentByIdController =
  Controller<ProductCommentParamsDto>;
