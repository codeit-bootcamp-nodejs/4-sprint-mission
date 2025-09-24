import type { Controller } from "../controller.js";
import type {
  ProductBodyDto,
  ProductParamsDto,
  ProductQueryDto,
} from "../../dto/request/product.request.dto.js";

export type CreateProductController = Controller<{}, unknown, ProductBodyDto>;

export type GetProductByIdController = Controller<ProductParamsDto>;

export type UpdateProductController = Controller<
  ProductParamsDto,
  unknown,
  ProductBodyDto
>;

export type DeleteProductController = Controller<ProductParamsDto>;

export type ListProductController = Controller<
  {},
  unknown,
  {},
  ProductQueryDto
>;

export type ToggleProductLikeController = Controller<ProductParamsDto>;
