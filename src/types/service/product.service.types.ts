import type { Product, ProductLike } from "@prisma/client";
import type {
  listProductDto,
  getProductByIdDto,
  createProductDto,
  updateProductDto,
  deleteProductDto,
  toggleProductLikeDto,
} from "../../dto/service/product.service.dto.js";

/** CREATE */
export type CreateProductInput = createProductDto & {
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
};
export type CreateProductResult =
  | (Product & {
      productImages: { image: { url: string } }[];
    })
  | null;

/** GET by ID */
export type GetProductByIdInput = getProductByIdDto;
export type GetProductByIdResult =
  | (Product & {
      User: { id: number; nickname: string } | null;
      productLikes: { userId: number }[];
      _count: { productLikes: number };
      productImages: { image: { url: string } }[];
    })
  | null;

/** UPDATE */
export type UpdateProductInput = updateProductDto;
export type UpdateProductResult = Product;

/** DELETE */
export type DeleteProductInput = deleteProductDto;
export type DeleteProductResult = Product;

/** LIST */
export type ListProductInput = listProductDto;
export interface ListProductResult {
  data: (Product & {
    productImages: { image: { url: string } }[];
  })[];
  total: number;
  page: number;
  pageSize: number;
}

/** LIKE */
export type ToggleProductLikeInput = toggleProductLikeDto;
export type ToggleProductLikeResult = {
  isLiked: boolean;
  likeCount: number;
};
