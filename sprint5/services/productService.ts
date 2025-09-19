import prisma from "../lib/prisma.js";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  tag?: [];
  createdAt: Date;
  updatedAt?: Date;
}

interface ProductWithLike extends Product {
  isLiked: boolean;
}

export const getProducts = async (
  offset: number,
  limit: number,
  name: string | undefined,
  description: string | undefined,
  userId: number | null
): Promise<ProductWithLike[]> => {
  const filter = [];

  if (name) {
    filter.push({ name: { contains: name } });
  }

  if (description) {
    filter.push({ description: { contains: description } });
  }

  const where = filter.length > 0 ? { OR: filter } : {};

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });

    if (!userId) {
      // 비로그인 유저면 그냥 isLiked는 false로 세팅 후 반환
      return products.map((products) => ({ ...products, isLiked: false }));
    }

    const likedProducts = await prisma.like.findMany({
      where: {
        userId,
        productId: { in: products.map((p) => p.id) },
      },
      select: {
        productId: true,
      },
    });

    // 3. 좋아요 누른 상품 ID만 모아서 Set으로 만듦 (검색 빠르게 하기 위해)
    const likedProductIds = new Set(likedProducts.map((lp) => lp.productId));

    // 4. 각 상품에 isLiked 필드 추가
    return products.map((products) => ({
      ...products,
      isLiked: likedProductIds.has(products.id),
    }));
  } catch (err) {
    throw err;
  }
};

export const createProduct = async (
  name: string,
  description: string,
  price: number,
  tags: string[],
  userId: number
): Promise<Product> => {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        userId,
      },
    });

    return product;
  } catch (err) {
    throw err;
  }
};

export const findProductById = async (
  id: number,
  userId: number
): Promise<ProductWithLike> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });

    if (!product) {
      const error: HttpError = new Error("상품을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    let isLiked = false;
    if (userId) {
      const like = await prisma.like.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: id,
          },
        },
      });
      isLiked = !!like; // like가 있으면 true, 없으면 false
    }

    return { ...product, isLiked };
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (
  id: number,
  name: string | undefined,
  description: string | undefined,
  price: number | undefined,
  tags: string[] | undefined,
  userId: number
): Promise<Product> => {
  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      const error: HttpError = new Error("상품을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (product.userId != userId) {
      const error: HttpError = new Error("상품을 수정할 권한이 없습니다.");
      error.status = 403;
      throw error;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(tags !== undefined && { tags }),
      },
    });

    return updatedProduct;
  } catch (err) {
    throw err;
  }
};

export const removeProduct = async (
  id: number,
  userId: number
): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      const error: HttpError = new Error("상품을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (product.userId != userId) {
      const error: HttpError = new Error("상품을 삭제할 권한이 없습니다.");
      error.status = 403;
      throw error;
    }

    await prisma.product.delete({ where: { id } });
  } catch (err) {
    throw err;
  }
};
