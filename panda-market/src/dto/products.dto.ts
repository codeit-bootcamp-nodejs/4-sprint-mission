import type { Transaction } from '@/types/shared.types.js';
import type { BaseProductInput, ProductId } from '@/types/product.types.js';
import { Prisma } from '@prisma/client';
import { UserId } from '@/types/user.types.js';

// Request Dtos
export interface ProductParams extends UserId, ProductId, Transaction {}

export interface PostProductDTO extends UserId {
  data: BaseProductInput;
}

export interface CreateDTO extends Transaction {
  createData: Prisma.ProductCreateInput;
}

export interface PatchProductDTO extends ProductParams {
  data: Partial<BaseProductInput>;
}
export interface UpdateDTO extends ProductId, Transaction {
  patchData: Prisma.ProductUpdateInput;
}

export interface ProductIdWithTx extends ProductId, Transaction {}
