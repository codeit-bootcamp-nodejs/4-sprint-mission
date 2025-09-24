import type { User, Product, Article } from "@prisma/client";
import type {
  GetUserByIdDto,
  UpdateProfileDto,
  ChangePasswordDto,
  DeleteUserByIdDto,
  GetUserProductsDto,
  GetLikedProductsDto,
  GetLikedArticlesDto,
} from "../../dto/service/user.service.dto.js";

// 프로필 조회
export type GetUserByIdInput = GetUserByIdDto;
export type GetUserByIdResult = {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// 프로필 수정
export type UpdateProfileInput = UpdateProfileDto;
export type UpdateProfileResult = {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  updatedAt: Date;
};

// 비밀번호 변경
export type ChangePasswordInput = ChangePasswordDto;
export type ChangePasswordResult = {
  id: number;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
};

// 사용자 삭제
export type DeleteUserByIdInput = DeleteUserByIdDto;
export type DeleteUserByIdResult = {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// 유저가 등록한 상품 목록
export type GetUserProductsInput = GetUserProductsDto;
export type GetUserProductsResult = {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}[];

// 유저가 좋아요한 상품 목록
export type GetLikedProductsInput = GetLikedProductsDto;
export type GetLikedProductsResult = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
  User: {
    id: number;
    nickname: string;
  } | null;
  _count: { productLikes: number };
}[];

// 유저가 좋아요한 게시글 목록 조회
export type GetLikedArticlesInput = GetLikedArticlesDto;
export type GetLikedArticlesResult = (Article & {
  User: { id: number; nickname: string } | null;
  _count: { articleLikes: number };
})[];
