import { Response } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import prisma from '../utils/prisma';
import { 
  AuthenticatedRequest,
  CommentRequest,
  PaginationQuery,
  PaginatedResponse,
  Comment,
  ApiResponse
} from '../types';

// 댓글 생성/수정 유효성 검사
export const commentValidation: ValidationChain[] = [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('댓글 내용은 1~1000자 사이여야 합니다.')
];

// 상품 댓글 생성 (로그인 필수)
export const createProductComment = async (
  req: AuthenticatedRequest & { body: CommentRequest; params: { id: string } },
  res: Response<ApiResponse<{ comment: Comment }>>
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

    const { id } = req.params; // 상품 ID
    const { content } = req.body;

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

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: req.user.id,
        productId: parseInt(id)
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      }
    });

    res.status(201).json({
      message: '댓글이 성공적으로 등록되었습니다.',
      data: { comment }
    });

  } catch (error) {
    console.error('상품 댓글 생성 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 게시글 댓글 생성 (로그인 필수)
export const createPostComment = async (
  req: AuthenticatedRequest & { body: CommentRequest; params: { id: string } },
  res: Response<ApiResponse<{ comment: Comment }>>
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

    const { id } = req.params; // 게시글 ID
    const { content } = req.body;

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

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: req.user.id,
        postId: parseInt(id)
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      }
    });

    res.status(201).json({
      message: '댓글이 성공적으로 등록되었습니다.',
      data: { comment }
    });

  } catch (error) {
    console.error('게시글 댓글 생성 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 상품 댓글 목록 조회
export const getProductComments = async (
  req: AuthenticatedRequest & { params: { id: string }; query: PaginationQuery },
  res: Response<PaginatedResponse<Comment>>
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

    // 댓글 목록 조회
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(id) },
      include: {
        author: {
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
    const totalCount = await prisma.comment.count({
      where: { productId: parseInt(id) }
    });

    const result = {
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + comments.length < totalCount
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('상품 댓글 목록 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};

// 게시글 댓글 목록 조회
export const getPostComments = async (
  req: AuthenticatedRequest & { params: { id: string }; query: PaginationQuery },
  res: Response<PaginatedResponse<Comment>>
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

    // 댓글 목록 조회
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(id) },
      include: {
        author: {
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
    const totalCount = await prisma.comment.count({
      where: { postId: parseInt(id) }
    });

    const result = {
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + comments.length < totalCount
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('게시글 댓글 목록 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};

// 댓글 수정 (작성자만 가능)
export const updateComment = async (
  req: AuthenticatedRequest & { body: CommentRequest; params: { id: string } },
  res: Response<ApiResponse<{ comment: Comment }>>
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

    const { id } = req.params; // 댓글 ID
    const { content } = req.body;

    // 댓글 존재 및 권한 확인
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingComment) {
      res.status(404).json({
        error: '댓글을 찾을 수 없습니다.'
      });
      return;
    }

    if (existingComment.authorId !== req.user.id) {
      res.status(403).json({
        error: '댓글을 수정할 권한이 없습니다.'
      });
      return;
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      }
    });

    res.status(200).json({
      message: '댓글이 성공적으로 수정되었습니다.',
      data: { comment: updatedComment }
    });

  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 댓글 삭제 (작성자만 가능)
export const deleteComment = async (
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params; // 댓글 ID

    // 댓글 존재 및 권한 확인
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingComment) {
      res.status(404).json({
        error: '댓글을 찾을 수 없습니다.'
      });
      return;
    }

    if (existingComment.authorId !== req.user.id) {
      res.status(403).json({
        error: '댓글을 삭제할 권한이 없습니다.'
      });
      return;
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      message: '댓글이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};