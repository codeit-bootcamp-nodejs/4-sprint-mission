import { Response } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import prisma from '../utils/prisma';
import { 
  AuthenticatedRequest,
  OptionalAuthRequest,
  ProductRequest,
  PaginationQuery,
  PaginatedResponse,
  Product,
  ApiResponse
} from '../types';

// 상품 생성/수정 유효성 검사
export const productValidation: ValidationChain[] = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('제목은 1~100자 사이여야 합니다.'),
  body('content')
    .isLength({ min: 1 })
    .withMessage('내용을 입력해주세요.'),
  body('price')
    .isInt({ min: 0 })
    .withMessage('가격은 0 이상의 정수여야 합니다.'),
  body('image')
    .optional()
    .isURL()
    .withMessage('올바른 이미지 URL 형식이 아닙니다.')
];

// 상품 목록 조회 (로그인 선택적)
export const getProducts = async (
  req: OptionalAuthRequest & { query: PaginationQuery },
  res: Response<PaginatedResponse<Product>>
): Promise<void> => {
  try {
    const { page = '1', limit = '10', search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // 검색 조건
    const where = search ? {
      OR: [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    } : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        // 로그인한 사용자가 있다면 좋아요 상태도 조회
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip.toString()),
      take: parseInt(limit)
    });

    // 총 개수 조회
    const totalCount = await prisma.product.count({ where });

    const result = {
      data: products.map(product => ({
        ...product,
        likesCount: product._count.likes,
        commentsCount: product._count.comments,
        isLiked: req.user ? (product.likes as any[]).length > 0 : false,
        _count: undefined as any,
        likes: undefined as any
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + products.length < totalCount
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};

// 상품 상세 조회 (로그인 선택적)
export const getProduct = async (
  req: OptionalAuthRequest & { params: { id: string } },
  res: Response<ApiResponse<{ product: Product }>>
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        // 로그인한 사용자가 있다면 좋아요 상태도 조회
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false,
        // 댓글 목록
        comments: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      res.status(404).json({
        error: '상품을 찾을 수 없습니다.'
      });
      return;
    }

    const result = {
      data: {
        product: {
          ...product,
          likesCount: product._count.likes,
          commentsCount: product._count.comments,
          isLiked: req.user ? (product.likes as any[]).length > 0 : false,
          _count: undefined as any,
          likes: undefined as any
        }
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('상품 상세 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 상품 생성 (로그인 필수)
export const createProduct = async (
  req: AuthenticatedRequest & { body: ProductRequest },
  res: Response<ApiResponse<{ product: Product }>>
): Promise<void> => {
  try {
    // 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: '유효성 검사 실패',
        details: errors.array()
      });
      return;
    }

    const { title, content, price, image } = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        content,
        price: parseInt(price.toString()),
        image,
        authorId: req.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    res.status(201).json({
      message: '상품이 성공적으로 등록되었습니다.',
      data: {
        product: {
          ...product,
          likesCount: product._count.likes,
          commentsCount: product._count.comments,
          isLiked: false,
          _count: undefined as any
        }
      }
    });

  } catch (error) {
    console.error('상품 생성 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 상품 수정 (작성자만 가능)
export const updateProduct = async (
  req: AuthenticatedRequest & { body: ProductRequest; params: { id: string } },
  res: Response<ApiResponse<{ product: Product }>>
): Promise<void> => {
  try {
    // 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: '유효성 검사 실패',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { title, content, price, image } = req.body;

    // 상품 존재 및 권한 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      res.status(404).json({
        error: '상품을 찾을 수 없습니다.'
      });
      return;
    }

    if (existingProduct.authorId !== req.user.id) {
      res.status(403).json({
        error: '상품을 수정할 권한이 없습니다.'
      });
      return;
    }

    // 상품 수정
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        price: parseInt(price.toString()),
        image
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        likes: {
          where: { userId: req.user.id },
          select: { id: true }
        }
      }
    });

    res.status(200).json({
      message: '상품이 성공적으로 수정되었습니다.',
      data: {
        product: {
          ...updatedProduct,
          likesCount: updatedProduct._count.likes,
          commentsCount: updatedProduct._count.comments,
          isLiked: (updatedProduct.likes as any[]).length > 0,
          _count: undefined as any,
          likes: undefined as any
        }
      }
    });

  } catch (error) {
    console.error('상품 수정 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 상품 삭제 (작성자만 가능)
export const deleteProduct = async (
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;

    // 상품 존재 및 권한 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      res.status(404).json({
        error: '상품을 찾을 수 없습니다.'
      });
      return;
    }

    if (existingProduct.authorId !== req.user.id) {
      res.status(403).json({
        error: '상품을 삭제할 권한이 없습니다.'
      });
      return;
    }

    // 상품 삭제 (관련된 댓글, 좋아요도 CASCADE로 자동 삭제)
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      message: '상품이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('상품 삭제 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};