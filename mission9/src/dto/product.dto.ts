import type { Comment, ProductTag } from "@prisma/client";

export interface productDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  ownerId: number;
  userId?: number;
  comment?: Comment[];
  productTags?: number[];
}

export interface ProductQueryDTO {
  page: number;
  take: number;
  name?: string;
  description?: string;
  keyword?: string;
}
