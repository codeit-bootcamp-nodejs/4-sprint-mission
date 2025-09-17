import { clearTokenCookies } from "../lib/cookies.js";
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

// 프로필 조회
export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const safeUser = removeSensitiveFields(user);
    res.status(200).json({ data: safeUser });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 프로필 수정
export async function updateProfile(req, res) {
  try {
    const { nickname, image } = req.body;
    const updatedUser = await updateUserProfile(req.user.id, req.body);
    const safeUser = removeSensitiveFields(updatedUser);
    res.status(200).json({ data: safeUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(400).json({ message: error.message });
  }
}

// 비밀번호 변경
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    // 비밀번호 동일 여부 체크
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "새로운 비밀번호는 현재 비밀번호와 동일할 수 없습니다.",
      });
    }

    await changeUserPassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(400).json({ message: error.message });
  }
}

// 계정 삭제
export async function deleteUser(req, res) {
  try {
    await deleteUserById(req.user.id);
    clearTokenCookies(res);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma not found error code
      return res.status(404).json({ message: "User not found" });
    }
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 유저가 등록한 상품 목록 조회
export async function getProducts(req, res) {
  try {
    const products = await getUserProducts(req.user.id);
    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 유저가 좋아요한 상품 목록 조회
export async function getLikedProductsHandler(req, res) {
  try {
    const userId = req.user.id;

    // 서비스 함수 호출: 해당 유저가 좋아요한 상품 리스트 반환
    const likedProducts = await getLikedProducts(userId);

    // 응답 변환
    const response = likedProducts.map((product) => ({
      id: product.id,
      title: product.title,
      content: product.content,
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
}

// 유저가 좋아요한 게시글 목록 조회
export async function getLikedArticlesHandler(req, res, next) {
  try {
    const userId = req.user.id;

    // 서비스 함수 호출
    const likedArticles = await getLikedArticles(userId);

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
}
