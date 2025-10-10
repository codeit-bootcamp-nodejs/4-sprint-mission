import { Response } from 'express';
import prisma from '../utils/prisma';
import { 
  AuthenticatedRequest,
  PaginationQuery,
  PaginatedResponse,
  ProductLike,
  PostLike,
  ApiResponse
} from '../types';

// 상품 좋아요/취소 토글
export const toggleProductLike = async (
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response<ApiResponse<{ isLiked: boolean }>>
): Promise<void> => {
  try {
    const { id } = req.params; // 상품 ID
    const userId = req.user.id;

    // 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      res.status(404).json({
        error: '상품을 찾을 수 없습니다.'
      });
      return;
    }

    // 이미 좋아요했는지 확인
    const existingLike = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(id)
        }
      }
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.productLike.delete({
        where: { id: existingLike.id }
      });

      res.status(200).json({
        message: '좋아요가 취소되었습니다.',
        data: { isLiked: false }
      });
    } else {
      // 좋아요 추가
      await prisma.productLike.create({
        data: {
          userId,
          productId: parseInt(id)
        }
      });

      res.status(200).json({
        message: '좋아요가 추가되었습니다.',
        data: { isLiked: true }
      });
    }

  } catch (error) {
    console.error('상품 좋아요 토글 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 게시글 좋아요/취소 토글
export const togglePostLike = async (
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response<ApiResponse<{ isLiked: boolean }>>
): Promise<void> => {
  try {
    const { id } = req.params; // 게시글 ID
    const userId = req.user.id;

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      res.status(404).json({
        error: '게시글을 찾을 수 없습니다.'
      });
      return;
    }

    // 이미 좋아요했는지 확인
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: parseInt(id)
        }
      }
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.postLike.delete({
        where: { id: existingLike.id }
      });

      res.status(200).json({
        message: '좋아요가 취소되었습니다.',
        data: { isLiked: false }
      });
    } else {
      // 좋아요 추가
      await prisma.postLike.create({
        data: {
          userId,
          postId: parseInt(id)
        }
      });

      res.status(200).json({
        message: '좋아요가 추가되었습니다.',
        data: { isLiked: true }
      });
    }

  } catch (error) {
    console.error('게시글 좋아요 토글 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 상품 좋아요 상태 조회
export const getProductLikeStatus = async (
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response<ApiResponse<{ productId: number; likesCount: number; isLiked: boolean }>>
): Promise<void> => {
  try {
    const { id } = req.params; // 상품 ID
    const userId = req.user.id;

    // 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { likes: true }
        },
        likes: {
          where: { userId },
          select: { id: true }
        }
      }
    });

    if (!product) {
      res.status(404).json({
        error: '상품을 찾을 수 없습니다.'
      });
      return;
    }

    res.status(200).json({
      data: {
        productId: parseInt(id),
        likesCount: product._count.likes,
        isLiked: product.likes.length > 0
      }
    });

  } catch (error) {
    console.error('상품 좋아요 상태 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 게시글 좋아요 상태 조회
export const getPostLikeStatus = async (
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response<ApiResponse<{ postId: number; likesCount: number; isLiked: boolean }>>
): Promise<void> => {
  try {
    const { id } = req.params; // 게시글 ID
    const userId = req.user.id;

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { likes: true }
        },
        likes: {
          where: { userId },
          select: { id: true }
        }
      }
    });

    if (!post) {
      res.status(404).json({
        error: '게시글을 찾을 수 없습니다.'
      });
      return;
    }

    res.status(200).json({
      data: {
        postId: parseInt(id),
        likesCount: post._count.likes,
        isLiked: post.likes.length > 0
      }
    });

  } catch (error) {
    console.error('게시글 좋아요 상태 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 상품 좋아요한 사용자 목록 조회
export const getProductLikes = async (
  req: AuthenticatedRequest & { params: { id: string }; query: PaginationQuery },
  res: Response<PaginatedResponse<ProductLike>>
): Promise<void> => {
  try {
    const { id } = req.params; // 상품 ID
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      res.status(404).json({
        error: '상품을 찾을 수 없습니다.'
      } as any);
      return;
    }

    // 좋아요한 사용자 목록 조회
    const likes = await prisma.productLike.findMany({
      where: { productId: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip.toString()),
      take: parseInt(limit)
    });

    // 총 개수 조회
    const totalCount = await prisma.productLike.count({
      where: { productId: parseInt(id) }
    });

    const result = {
      data: likes.map(like => ({
        id: like.id,
        userId: like.userId,
        productId: like.productId,
        createdAt: like.createdAt,
        user: like.user
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + likes.length < totalCount
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('상품 좋아요 사용자 목록 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};

// 게시글 좋아요한 사용자 목록 조회
export const getPostLikes = async (
  req: AuthenticatedRequest & { params: { id: string }; query: PaginationQuery },
  res: Response<PaginatedResponse<PostLike>>
): Promise<void> => {
  try {
    const { id } = req.params; // 게시글 ID
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      res.status(404).json({
        error: '게시글을 찾을 수 없습니다.'
      } as any);
      return;
    }

    // 좋아요한 사용자 목록 조회
    const likes = await prisma.postLike.findMany({
      where: { postId: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip.toString()),
      take: parseInt(limit)
    });

    // 총 개수 조회
    const totalCount = await prisma.postLike.count({
      where: { postId: parseInt(id) }
    });

    const result = {
      data: likes.map(like => ({
        id: like.id,
        userId: like.userId,
        postId: like.postId,
        createdAt: like.createdAt,
        user: like.user
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + likes.length < totalCount
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('게시글 좋아요 사용자 목록 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};