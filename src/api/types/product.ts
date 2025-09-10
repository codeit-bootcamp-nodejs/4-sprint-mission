export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  tags: string[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}

export type ProductOrder = "oldest" | "recent";

// export interface FindManyProductParams {
//   offset: number;
//   limit: number;
//   order?: string;
//   keyword?: string;
// }
