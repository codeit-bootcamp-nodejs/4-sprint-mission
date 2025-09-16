import type { ProductComment } from "@prisma/client";
import type {
  listProductCommentDto,
  getProductCommentByIdDto,
  createProductCommentDto,
  updateProductCommentDto,
  deleteProductCommentDto,
} from "../../dto/service/product-comment.service.dto.js";

/** CREATE */
export type CreateProductCommentInput = createProductCommentDto;
export type CreateProductCommentResult = ProductComment;

/** UPDATE */
export type UpdateProductCommentInput = updateProductCommentDto;
export type UpdateProductCommentResult = ProductComment;

/** DELETE */
export type DeleteProductCommentInput = deleteProductCommentDto;
export type DeleteProductCommentResult = ProductComment;

/** LIST */
export type ListProductCommentInput = listProductCommentDto;
export type ListProductCommentResult = ProductComment[];

/** GET by ID */
export type GetProductCommentByIdInput = getProductCommentByIdDto;
export type GetProductCommentByIdResult =
  | (ProductComment & { User: { id: number; nickname: string } | null })
  | null;
