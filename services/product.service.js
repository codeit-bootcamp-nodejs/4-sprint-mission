import prisma from '../prisma/prisma.js'


// 상품 목록 조회
export async function ProdcutListupService(userId) {
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
    const error = new Error("등록한 상품이 없습니다.")
    error.status = 404;
    throw error;
  }
  return listup;
}


// 로그인한 유저만 상품 등록
export async function ProductRegisterService(userId, title, content) {
  // 유효성 검사
  if (!title || !content) {
    const error = new Error("상품 제목과 내용을 입력해주세요")
    error.status = 404;
    throw error;
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
export async function ProductPutService(userId, productId, title, content) {
  // DB에서 상품 정보 가져오기
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  
  if (!product) {
    const error = new Error("상품을 찾을 수 없습니다.")
    error.status = 404;
    throw error;
  }
  
  // 상품 소유자 검증
  if (product.userId !== userId) {
    const error = new Error("상품을 수정할 권한이 없습니다.")
    error.status = 403;
    throw error;
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
export async function ProductDeleteService(userId, productId) {
  // 삭제할 데이터 확인
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  
  if (!product) {
    const error = new Error("상품이 존재하지 않습니다.")
    error.status = 404;
    throw error;
  }
  
  // 상품을 등록한 유저가 맞는지 확인
  if (product.userId !== userId) {
    const error = new Error("상품을 삭제할 권한이 없습니다.")
    error.status = 403;
    throw error;
  }
  
  // 상품 삭제
  const deletedProduct = await prisma.product.delete({
    where: { id: Number(productId) },
  });

  return deletedProduct;
}