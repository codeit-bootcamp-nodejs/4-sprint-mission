import { clearTokenCookies } from "../lib/cookies.js";
import { Prisma } from "@prisma/client";
import {
  getUserById,
  updateUserProfile,
  changeUserPassword,
  getUserProducts,
  deleteUserById,
  getLikedProducts,
  getLikedArticles,
} from "../services/userService.js";
import { removeSensitiveFields } from "../lib/utils.js";
import type {
  UpdateProfileController,
  ChangePasswordController,
} from "../types/controller/user.controller.types.js";
import type { QueryGuard } from "../types/controller/queryGuard.controller.types.js";

// 프로필 조회
export const getProfileController: QueryGuard = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const userId = req.user.id;
    const user = await getUserById({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const safeUser = removeSensitiveFields(user);
    res.status(200).json({ data: safeUser });
  } catch (error) {
    next(error);
  }
};

// 프로필 수정
export const updateProfileController: UpdateProfileController = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const data = {
      nickname: req.body.nickname ?? "",
      image: req.body.image ?? "",
      userId: req.user.id,
    };

    const updatedUser = await updateUserProfile(data);
    const safeUser = removeSensitiveFields(updatedUser);
    res.status(200).json({ data: safeUser });
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
export const changePasswordController: ChangePasswordController = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const { currentPassword, newPassword } = req.body;

    // 비밀번호 동일 여부 체크
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "새로운 비밀번호는 현재 비밀번호와 동일할 수 없습니다.",
      });
    }
    const data = {
      userId: req.user.id,
      currentPassword,
      newPassword,
    };
    await changeUserPassword(data);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// 계정 삭제
export const deleteUserController: QueryGuard = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const userId = req.user.id;
    await deleteUserById({ userId });
    clearTokenCookies(res);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "User not found" });
      }
      next(error);
    }
  }
};

// 유저가 등록한 상품 목록 조회
export const getProductsController: QueryGuard = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const userId = req.user.id;
    const products = await getUserProducts({ userId });
    res.status(200).json({ data: products });
  } catch (error) {
    next(error);
  }
};

// 유저가 좋아요한 상품 목록 조회
export const getLikedProductsController: QueryGuard = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const userId = req.user.id;

    // 서비스 함수 호출: 해당 유저가 좋아요한 상품 리스트 반환
    const likedProducts = await getLikedProducts({ userId });

    // 응답 변환
    const response = likedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      userId: product.userId,
      user: product.User, // Prisma 기본 include User → user로 변경
      likeCount: product._count.productLikes, // _count → likeCount
      isLiked: true, // 좋아요 목록이라 항상 true
    }));

    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
};

// 유저가 좋아요한 게시글 목록 조회
export const getLikedArticlesController: QueryGuard = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const userId = req.user.id;

    // 서비스 함수 호출
    const likedArticles = await getLikedArticles({ userId });

    // 응답 변환
    const response = likedArticles.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      userId: article.userId,
      user: article.User, // Prisma 기본 include User → user로 변경
      likeCount: article._count.articleLikes, // _count → likeCount
      isLiked: true, // 좋아요 목록이라 항상 true
    }));

    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
};
