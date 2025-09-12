import prisma from "../prisma/prisma.js";

// 로그인한 유저는 상품에 '좋아요' 와 '좋아요 취소' 가능                                 좋아요는 함수하나에 두개씩 들어가 있어서 한번더 확인 필요
export async function likeProductService(userId, productId) {
  // 좋아요가 이미 있는지 확인
  const existingLike = await prisma.like.findUnique({
     where: {
    userId_productId: { // 복합 키 사용
      userId,
      productId,
    },
  },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
      return { message: "좋아요 취소" };
  } else { 
    const createdLike = await prisma.like.create({
    data: {
      userId,
      productId,
    },
  });
    return {
      message: "좋아요 추가",
      data: createdLike,
    }
    }
}

// 로그인한 유저는 게시글에 '좋아요'와 '좋아요 취소' 가능
export async function likePostService(userId, postId) {
  // 좋아요가 이미 있는지 확인 하고 있으면 좋아요 취소, 없으면 좋아요 추가
  const existingLike = await prisma.like.findUnique({
    where: {
    userId_postId: {  // 복합 유니크 키 이름
      userId,
      postId
    }
  }
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { message: "좋아요 취소" };
  } else {
    const createdLikePost = await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });
  return {
    message: "좋아요 추가",
    data: createdLikePost
  }
  }
}

// 상품 또는 게시글을 조회할 때, 유저가 '좋아요'를 누른 항목인지 확인할 수 있도록 isLiked와 같은 불린형 필드를 리스폰스 객체에 포함시켜 리스폰스해 주세요.
// 상품을 조회할 때 , 유저가 좋아요를 누른 항목인지 먼저 작성
export async function guessLikedProductService(userId, productId) {
  const listup = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!listup) {
    const error = new Error("상품을 찾을 수 없습니다.")
    error.status = 404;
    throw error;
  }

  // 좋아요 여부 확인 (이해 못함)
  let isLiked = false;
  if (userId) {
    const like = await prisma.like.findFirst({
      where: { userId, productId },
      select: { id: true },
    });
    isLiked = !!like;
  }
  return { listup, isLiked };
}

// 게시글을 조회할 때 좋아요를 누른 항목인지 먼저 작성
export async function guessLikedPostService(userId, postId) {
  const listup = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!listup) {
    const error = new Error("게시글을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  // 좋아요 여부 확인 (이해 못함)
  let isLiked = false;
  if (userId) {
    const like = await prisma.like.findFirst({
      where: { userId, postId },
      select: { id: true },
    });
    isLiked = !!like;
  }
  return { listup, isLiked };
}

// 유저가 '좋아요'를 표시한 상품의 목록을 조회하는 기능을 구현합니다.
export async function likeProductListService(userId) {
  const list = await prisma.like.findMany({
    where: { userId },
    select: {
      Product: {
        select: {
          id: true,
          title: true,
          content: true,
        },
      },
    },
  });

  if (list.length === 0) {
    const error = new Error("좋아요를 표시한 상품이 없습니다.");
    error.status = 404;
    throw error;
  }
  return list;
}
