import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listProduct,
  toggleProductLike,
} from "../services/productService.js";
import { DEFAULT_PAGE, MIN_PAGESIZE, MAX_PAGESIZE } from "../lib/constants.js";
import { makeAbsoluteUrl } from "../lib/utils.js";
import type {
  CreateProductController,
  GetProductByIdController,
  UpdateProductController,
  DeleteProductController,
  ListProductController,
  ToggleProductLikeController,
} from "../types/controller/product.controller.types.js";

export const createProductController: CreateProductController = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const data = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      tags: req.body.tags ?? [],
      userId: req.user.id,
      files: req.files ?? [],
    };

    const newProduct = await createProduct(data);
    if (!newProduct) {
      return res.status(500).json({ error: "상품 생성 실패" });
    }

    // ✅ 응답 변환
    const response = {
      ...newProduct,
      images: newProduct.productImages.map((pi) =>
        makeAbsoluteUrl(pi.image.url, req)
      ),
    };

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController: GetProductByIdController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    const product = await getProductById({ id });
    if (!product) {
      return res
        .status(404)
        .json({ error: `${id}에 해당하는 상품을 찾을 수 없습니다` });
    }

    // ✅ 로그인 사용자 ID (passport로 인증된 경우만)
    const userId = req.user?.id;

    // ✅ 응답 변환
    const response = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      user: product.User,
      images: product.productImages.map((pi) =>
        pi.image?.url ? makeAbsoluteUrl(pi.image.url, req) : null
      ),
      createdAt: product.createdAt,
      likeCount: product._count.productLikes,
      isLiked: userId
        ? product.productLikes.some((like) => like.userId === userId)
        : false,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateProductController: UpdateProductController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    // 기존 상품 조회
    const product = await getProductById({ id });
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    // 작성자 확인
    if (product.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    const data = {
      id,
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      tags: req.body.tags ?? [],
    };

    const productPatched = await updateProduct(data);

    res.status(200).json(productPatched);
  } catch (error) {
    next(error);
  }
};

export const deleteProductController: DeleteProductController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    // 기존 상품 조회
    const product = await getProductById({ id });
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    // 작성자 확인
    if (product.userId !== req.user.id) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }

    await deleteProduct({ id });
    res.status(200).json({ message: "상품을 삭제했습니다" });
  } catch (error) {
    next(error);
  }
};

export const listProductController: ListProductController = async (
  req,
  res,
  next
) => {
  try {
    const page = Math.max(Number(req.query.page) ?? DEFAULT_PAGE, DEFAULT_PAGE);
    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) ?? MIN_PAGESIZE, MIN_PAGESIZE),
      MAX_PAGESIZE
    );
    const rawKeyword = req.query.keyword;

    const keywordArray = rawKeyword
      ? Array.isArray(rawKeyword)
        ? rawKeyword.map(String)
        : [String(rawKeyword)]
      : undefined;

    const result = await listProduct({
      page,
      pageSize,
      ...(keywordArray ? { keyword: keywordArray } : {}),
    });

    // ✅ 응답 변환 (썸네일 URL 추가)
    const response = {
      data: result.data.map((p) => ({
        ...p,
        thumbnail: p.productImages[0]
          ? makeAbsoluteUrl(p.productImages[0].image.url, req)
          : null,
      })),
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
        hasNextPage: result.page * result.pageSize < result.total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// 상품 좋아요 또는 좋아요 취소 (toggle)
export const toggleProductLikeController: ToggleProductLikeController = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const data = { userId: req.user.id, id: Number(req.params.id) };

    // 서비스 함수 호출: 이미 좋아요 상태면 삭제, 아니면 생성 및 최신 데이터 다시 가져오기 (좋아요 개수 + 내가 눌렀는지)
    const result = await toggleProductLike(data);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
