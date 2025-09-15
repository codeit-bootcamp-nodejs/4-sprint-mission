export interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  productId?: number;
  articleId?: number;
  user: {
    id: number;
    nickname: string;
    image?: string;
  };
}