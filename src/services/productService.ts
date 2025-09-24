import prisma from "../lib/prisma.js";
import { saveUploadedImages } from "./imageUploadService.js";
import { DEFAULT_PAGE, MIN_PAGESIZE, MAX_PAGESIZE } from "../lib/constants.js";
import type {
  CreateProductInput,
  CreateProductResult,
  GetProductByIdInput,
  GetProductByIdResult,
  UpdateProductInput,
  UpdateProductResult,
  DeleteProductInput,
  DeleteProductResult,
  ListProductInput,
  ListProductResult,
  ToggleProductLikeInput,
  ToggleProductLikeResult,
} from "../types/service/product.service.types.js";

export async function createProduct(
  data: CreateProductInput
): Promise<CreateProductResult> {
  return await prisma.$transaction(async (tx) => {
    const { files = [] } = data;

    // 1. 상품 생성
    const createData: any = {
      name: data.name,
      description: data.description,
      price: data.price,
      userId: data.userId,
    };

    if (data.tags?.length) {
      createData.tags = data.tags;
    }

    const newProduct = await tx.product.create({ data: createData });

    // 2. 이미지 저장 + ProductImage 연결
    const filesArray = Array.isArray(data.files)
      ? data.files
      : data.files
      ? Object.values(data.files).flat()
      : [];

    if (filesArray.length > 0) {
      const images: { id: number; url: string }[] = await saveUploadedImages(
        tx,
        filesArray
      );

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

export async function getProductById(
  data: GetProductByIdInput
): Promise<GetProductByIdResult> {
  return await prisma.product.findUnique({
    where: { id: data.id },
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

export async function updateProduct(
  data: UpdateProductInput
): Promise<UpdateProductResult> {
  const productPatched = await prisma.product.update({
    where: { id: data.id },
    data,
  });
  return productPatched;
}

export async function deleteProduct(
  data: DeleteProductInput
): Promise<DeleteProductResult> {
  const product = await prisma.product.delete({
    where: { id: data.id },
  });
  return product;
}

export async function listProduct({
  page = DEFAULT_PAGE,
  pageSize = MIN_PAGESIZE,
  keyword,
}: ListProductInput): Promise<ListProductResult> {
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
  return {
    data: products,
    total,
    page,
    pageSize,
  };
}

// 상품 좋아요 토글 (이미 좋아요 했다면 취소, 아니라면 좋아요 추가)
export async function toggleProductLike({
  userId,
  id,
}: ToggleProductLikeInput): Promise<ToggleProductLikeResult> {
  const existing = await prisma.productLike.findUnique({
    where: { userId_productId: { userId, productId: id } },
  });

  if (existing) {
    // 이미 좋아요를 눌렀다면 → 좋아요 취소
    await prisma.productLike.delete({
      where: { userId_productId: { userId, productId: id } },
    });
  } else {
    // 아직 좋아요하지 않았다면 → 좋아요 추가
    await prisma.productLike.create({ data: { userId, productId: id } });
  }

  // ✅ 토글 후 최신 좋아요 개수 조회
  const likeCount = await prisma.productLike.count({
    where: { productId: id },
  });

  return { isLiked: !existing, likeCount };
}
