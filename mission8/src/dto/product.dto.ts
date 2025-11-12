import type { Comment, ProductTag } from "@prisma/client";

export interface productDTO {
  id?: number ;
  name: string;
  description: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  ownerId: number;
  comment?:Comment[] | null;
  productTags?: number[];
}


export interface ProductQueryDTO {
  page: number;
  take: number;
  name?: string;
  description?: string;
  keyword?: string;
}


 