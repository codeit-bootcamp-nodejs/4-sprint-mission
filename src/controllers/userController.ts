import { Request, Response } from "express";
import { body, validationResult, ValidationChain } from "express-validator";
import prisma from "../utils/prisma";
import { hashPassword, comparePassword } from "../utils/auth";
import {
  UpdateProfileRequest,
  PaginatedResponse,
  Product,
  ApiResponse,
  UserResponse,
} from "../types";

// 비밀번호 변경 유효성 검사
export const changePasswordValidation: ValidationChain[] = [
  body("currentPassword")
    .notEmpty()
    .withMessage("현재 비밀번호를 입력해주세요."),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("새 비밀번호는 최소 6자 이상이어야 합니다.")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage("새 비밀번호는 영문과 숫자를 포함해야 합니다."),
];

// 프로필 업데이트 유효성 검사
export const updateProfileValidation: ValidationChain[] = [
  body("nickname")
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage("닉네임은 2~20자 사이여야 합니다.")
    .matches(/^[가-힣a-zA-Z0-9_]+$/)
    .withMessage("닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다."),
  body("image")
    .optional()
    .isURL()
    .withMessage("올바른 이미지 URL 형식이 아닙니다."),
];

// 내 정보 조회
export const getMyProfile = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: res.locals.user.id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "사용자를 찾을 수 없습니다.",
      });
      return;
    }

    res.status(200).json({ data: { user } });
  } catch (error) {
    console.error("내 정보 조회 오류:", error);
    res.status(500).json({
      error: "서버 내부 오류가 발생했습니다.",
    });
  }
};

// 내 정보 수정
export const updateMyProfile = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    // 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: "유효성 검사 실패",
        details: errors.array(),
      });
      return;
    }

    const { nickname, image } = req.body;
    const updateData: Partial<UpdateProfileRequest> = {};

    // 닉네임 변경 요청이 있는 경우 중복 검사
    if (nickname) {
      const existingUser = await prisma.user.findFirst({
        where: {
          nickname,
          NOT: { id: res.locals.user.id },
        },
      });

      if (existingUser) {
        res.status(409).json({
          error: "이미 사용 중인 닉네임입니다.",
        });
        return;
      }

      updateData.nickname = nickname;
    }

    // 이미지 URL 업데이트
    if (image !== undefined) {
      updateData.image = image;
    }

    // 업데이트할 데이터가 없는 경우
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        error: "업데이트할 정보가 없습니다.",
      });
      return;
    }

    // 사용자 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: res.locals.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "프로필이 성공적으로 업데이트되었습니다.",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    res.status(500).json({
      error: "서버 내부 오류가 발생했습니다.",
    });
  }
};

// 비밀번호 변경
export const changePassword = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    // 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: "유효성 검사 실패",
        details: errors.array(),
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // 현재 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: res.locals.user.id },
    });

    if (!user) {
      res.status(404).json({
        error: "사용자를 찾을 수 없습니다.",
      });
      return;
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      res.status(401).json({
        error: "현재 비밀번호가 올바르지 않습니다.",
      });
      return;
    }

    // 새 비밀번호가 현재 비밀번호와 같은지 확인
    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      res.status(400).json({
        error: "새 비밀번호는 현재 비밀번호와 달라야 합니다.",
      });
      return;
    }

    // 새 비밀번호 해싱
    const hashedNewPassword = await hashPassword(newPassword);

    // 비밀번호 업데이트
    await prisma.user.update({
      where: { id: res.locals.user.id },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    res.status(500).json({
      error: "서버 내부 오류가 발생했습니다.",
    });
  }
};

// 내가 등록한 상품 목록 조회
export const getMyProducts = async (
  req: Request,
  res: Response<PaginatedResponse<Product>>
): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const products = await prisma.product.findMany({
      where: { authorId: res.locals.user.id },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip.toString()),
      take: parseInt(limit as string),
    });

    // 총 개수 조회
    const totalCount = await prisma.product.count({
      where: { authorId: res.locals.user.id },
    });

    const result: PaginatedResponse<Product> = {
      data: products.map((product) => ({
        ...product,
        likesCount: product._count.likes,
        commentsCount: product._count.comments,
        image: product.image || undefined,
        author: product.author as UserResponse,
        _count: undefined as any,
      })),
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(totalCount / parseInt(limit as string)),
        totalCount,
        hasNext: skip + products.length < totalCount,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("내 상품 목록 조회 오류:", error);
    res.status(500).json({
      error: "서버 내부 오류가 발생했습니다.",
    } as any);
  }
};

// 내가 좋아요한 상품 목록 조회
export const getMyLikedProducts = async (
  req: Request,
  res: Response<PaginatedResponse<Product>>
): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const likedProducts = await prisma.productLike.findMany({
      where: { userId: res.locals.user.id },
      include: {
        product: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                image: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip.toString()),
      take: parseInt(limit as string),
    });

    // 총 개수 조회
    const totalCount = await prisma.productLike.count({
      where: { userId: res.locals.user.id },
    });

    const result: PaginatedResponse<Product> = {
      data: likedProducts.map((like) => ({
        ...like.product,
        likesCount: like.product._count.likes,
        commentsCount: like.product._count.comments,
        image: like.product.image || undefined,
        author: like.product.author as UserResponse,
        isLiked: true,
        _count: undefined as any,
      })),
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(totalCount / parseInt(limit as string)),
        totalCount,
        hasNext: skip + likedProducts.length < totalCount,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("내가 좋아요한 상품 목록 조회 오류:", error);
    res.status(500).json({
      error: "서버 내부 오류가 발생했습니다.",
    } as any);
  }
};
