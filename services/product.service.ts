import { prisma } from '../prisma/prisma.js'
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";
import type { Product } from "@prisma/client";
import { sendNotificationToUser } from '../app.js';
import { createNotification } from './notification.service.js';

dotenv.config();

// 상품 목록 조회
export async function prodcutListupService(): Promise<{
  id: number;
  price: number;
  title: string;
  content: string;
  image: string | null;
  tags: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  }[]> {
  const listup = await prisma.product.findMany({
    select: {
      id: true,
      price: true,
      title: true,
      content: true,
      image: true,
      tags: true,
      userId: true,
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
export async function productRegisterService(userId: number, price: number, title: string, content: string, image?: string | null, tags?: string[]): Promise<{
  id: number;
  price: number;
  title: string;
  content: string;
  image: string | null;
  tags: string[];
  createdAt: Date;
}> {
  // 유효성 검사
  if (!title || !content) {
    throw new HttpError("상품 제목과 내용을 입력해주세요.", 400);
  };
  if (!price) {
    throw new HttpError("상품 가격을 입력해주세요.", 400)
  };
  // 상품 등록
  const newProduct = await prisma.product.create({
    data: {
      title,
      price,
      content,
      image: image || null,
      tags: tags || [],
      userId,
    },
    select: {
      id: true,
      price: true,
      title: true,
      content: true,
      image: true,
      tags: true,
      createdAt: true,
    },
    });
  return newProduct;
}


// 상품을 등록한 유저만 해당 상품의 정보를 수정
export async function productPutService(userId: number, productId: number, price: number, title: string, content: string, image?: string | null, tags?: string[]): Promise<{
  id: number;
  price: number;
  title: string;
  content: string;
  image: string | null;
  tags: string[];
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
  
  // 가격 변동 여부 저장
  const beforePrice = product.price

  // 상품 정보 수정하기
  const updatedProduct =await prisma.product.update({
    where: { id: Number(productId) },
    data: {
      title,
      price,
      content,
      ...(image !== undefined && { image }),
      ...(tags !== undefined && { tags }),
    },
    select: {
      id: true,
      price: true,
      title: true,
      content: true,
      image: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  // 가격 변동 확인
  const priceChange = (updatedProduct.price !== beforePrice)

  // 상품 가격 변동시 좋아요한 유저들에게 알림 전송
  if (priceChange) {
    const likes = await prisma.like.findMany({
      where: {
        productId: Number(productId)
      },
    })
    for (const like of likes) {
      await createNotification ({
        userId: like.userId,
        type: "PRICE_CHANGE",
        message: `상품 ${updatedProduct.title}의 가격이 ${beforePrice}에서 ${price}로 변경되었습니다.`,
        productId: Number(productId),
        postId: null
      })
      sendNotificationToUser (like.userId, {
        id: updatedProduct.id,
        price: updatedProduct.price,
        title: updatedProduct.title,
        content: updatedProduct.content,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      })
    }

  }
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

// 상품 상세 조회 (좋아요 개수, 댓글 목록, 작성자 정보 포함)
export async function productDetailService(productId: number, userId?: number): Promise<{
  id: number;
  price: number;
  title: string;
  content: string;
  image: string | null;
  tags: string[];
  userId: number;
  userNickname: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  isLiked: boolean;
  comments: {
    id: number;
    content: string;
    userId: number;
    userNickname: string;
    createdAt: Date;
  }[];
}> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      User: {
        select: {
          id: true,
          nickname: true,
        },
      },
      likes: {
        select: {
          id: true,
          userId: true,
        },
      },
      comments: {
        include: {
          User: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    throw new HttpError("상품을 찾을 수 없습니다.", 404);
  }

  const likeCount = product.likes.length;
  const isLiked = userId
  ? product.likes.some((like: { userId: number }) => like.userId === userId)
  : false;

  return {
    id: product.id,
    price: product.price,
    title: product.title,
    content: product.content,
    image: product.image,
    tags: product.tags,
    userId: product.userId,
    userNickname: product.User.nickname,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    likeCount,
    isLiked,
    comments: product.comments.map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userNickname: comment.User.nickname,
      createdAt: comment.createdAt,
    })),
  };
}
