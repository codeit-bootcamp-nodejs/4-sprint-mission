import prisma from '../prisma/prisma.js'
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";
import type { Product } from "@prisma/client";
dotenv.config();

// 상품 목록 조회
export async function prodcutListupService(userId: number): Promise<{
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  }[]> {
  const listup = await prisma.product.findMany({
    where: { userId: userId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (listup.length === 0) {
    throw new HttpError("등록한 상품이 없습니다.", 404);
  }
  return listup;
}


// 로그인한 유저만 상품 등록
export async function productRegisterService(userId: number, title: string, content: string): Promise<{
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}> {
  // 유효성 검사
  if (!title || !content) {
    throw new HttpError("상품 제목과 내용을 입력해주세요.", 404);
  };

  // 싱픔 등록
  const newProduct = await prisma.product.create({
    data: {
      title,
      content,
      userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    });
  return newProduct;
}


// 상품을 등록한 유저만 해당 상품의 정보를 수정
export async function productPutService(userId: number, productId: number, title: string, content: string): Promise<{
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  }> {
  // DB에서 상품 정보 가져오기
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  
  if (!product) {
    throw new HttpError("상품을 찾을 수 없습니다.", 404);
  }
  
  // 상품 소유자 검증
  if (product.userId !== userId) {
    throw new HttpError("상품을 수정할 권한이 없습니다.", 403);
  }
  
  // 상품 정보 수정하기
  const updatedProduct = await prisma.product.update({
    where: { id: Number(productId) },
    data: {
      title,
      content,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedProduct;
}


// 상품을 등록한 유저만 상품 정보를 삭제
export async function productDeleteService(userId: number, productId: number): Promise<Product>
  {
  // 삭제할 데이터 확인
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  
  if (!product) {
    throw new HttpError("상품이 존재하지 않습니다.", 404);
  }
  
  // 상품을 등록한 유저가 맞는지 확인
  if (product.userId !== userId) {
    throw new HttpError("상품을 삭제할 권한이 없습니다.", 403);
  }
  
  // 상품 삭제
  const deletedProduct = await prisma.product.delete({
    where: { id: Number(productId) },
  });

  return deletedProduct;
}