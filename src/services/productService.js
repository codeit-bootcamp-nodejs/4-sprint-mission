import prisma from "../lib/prisma.js";
import { saveUploadedImages } from "./imageService.js";

export async function createProduct(data, files = []) {
  return await prisma.$transaction(async (tx) => {
    // 1. 상품 생성
    const newProduct = await tx.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
        userId: data.userId,
      },
    });

    // 2. 이미지 저장 + ProductImage 연결
    if (files && files.length > 0) {
      const images = await saveUploadedImages(tx, files);

      await tx.productImage.createMany({
        data: images.map((img) => ({
          productId: newProduct.id,
          imageId: img.id,
        })),
      });
    }

    // 3. 최종 반환 (연결된 이미지까지 포함)
    return await tx.product.findUnique({
      where: { id: newProduct.id },
      include: {
        productImages: { include: { image: true } },
      },
    });
  });
}

export async function getProductById(id) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      User: {
        select: {
          id: true,
          nickname: true, // 혹은 필요한 정보만
        },
      },
      productImages: {
        include: {
          image: true,
        },
      },
      productLikes: {
        select: { userId: true },
      },
      _count: {
        select: { productLikes: true },
      },
    },
  });
}

export async function updateProduct(id, data) {
  const productPatched = await prisma.product.update({
    where: { id },
    data,
  });
  return productPatched;
}

export async function deleteProduct(id) {
  const product = await prisma.product.delete({
    where: { id },
  });
  return product;
}

export async function listProduct({ page, pageSize, keyword }) {
  let where = {};

  const trimmedKeywords = Array.isArray(keyword)
    ? keyword.map((word) => word.trim()).filter((word) => word.length > 0)
    : [];

  if (trimmedKeywords.length > 0) {
    where = {
      OR: trimmedKeywords.flatMap((word) => [
        { name: { contains: word, mode: "insensitive" } },
        { description: { contains: word, mode: "insensitive" } },
      ]),
    };
  }

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    include: {
      productImages: {
        include: { image: true },
        take: 1, // ✅ 첫 번째 이미지만 썸네일 용도로 가져오기
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
  return { data: products, total, page, pageSize };
}

// 상품 좋아요 토글 (이미 좋아요 했다면 취소, 아니라면 좋아요 추가)
export async function toggleProductLike(userId, productId) {
  const existing = await prisma.productLike.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    // 이미 좋아요를 눌렀다면 → 좋아요 취소
    await prisma.productLike.delete({
      where: { userId_productId: { userId, productId } },
    });
  } else {
    // 아직 좋아요하지 않았다면 → 좋아요 추가
    await prisma.productLike.create({ data: { userId, productId } });
  }

  // ✅ 토글 후 최신 좋아요 개수 조회
  const likeCount = await prisma.productLike.count({ where: { productId } });

  return { isLiked: !existing, likeCount };
}
