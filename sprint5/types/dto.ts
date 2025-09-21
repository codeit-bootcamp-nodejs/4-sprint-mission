export interface GetArticleListQuery {
  offset?: string;
  limit?: string;
  title?: string;
  content?: string;
}

export interface ArticleId {
  id: string;
}

export interface ArticleBody {
  title?: string;
  content?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  userId?: number;
}

export interface ArticleWithLike extends Article {
  isLiked: boolean;
}

export interface GetProductListQuery {
  offset?: string;
  limit?: string;
  name?: string;
  description?: string;
}

export interface ProductId {
  id: string;
}

export interface ProductBody {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  tag?: [];
  createdAt: Date;
  updatedAt?: Date;
  userId?: number;
}

export interface ProductWithLike extends Product {
  isLiked: boolean;
}

export interface ArticleComment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductComment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export interface UpdateUserData {
  email?: string;
  nickname?: string;
  image?: string;
}

export interface UserProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  createdAt: Date;
}

export interface UserProductWithLike extends UserProduct {
  isLiked: boolean;
}

export interface Like {
  userId: number;
  articleId?: number | null;
  productId?: number | null;
}
