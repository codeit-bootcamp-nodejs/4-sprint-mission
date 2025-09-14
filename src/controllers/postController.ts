import { Response } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import prisma from '../utils/prisma';
import { 
  AuthenticatedRequest,
  OptionalAuthRequest,
  PostRequest,
  PaginationQuery,
  PaginatedResponse,
  Post,
  ApiResponse
} from '../types';

// 게시글 생성/수정 유효성 검사
export const postValidation: ValidationChain[] = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('제목은 1~100자 사이여야 합니다.'),
  body('content')
    .isLength({ min: 1 })
    .withMessage('내용을 입력해주세요.'),
  body('image')
    .optional()
    .isURL()
    .withMessage('올바른 이미지 URL 형식이 아닙니다.')
];

// 게시글 목록 조회 (로그인 선택적)
export const getPosts = async (
  req: OptionalAuthRequest & { query: PaginationQuery },
  res: Response<PaginatedResponse<Post>>
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

    const posts = await prisma.post.findMany({
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
    const totalCount = await prisma.post.count({ where });

    const result = {
      data: posts.map(post => ({
        ...post,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        isLiked: req.user ? (post.likes as any[]).length > 0 : false,
        _count: undefined as any,
        likes: undefined as any
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + posts.length < totalCount
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    } as any);
  }
};

// 게시글 상세 조회 (로그인 선택적)
export const getPost = async (
  req: OptionalAuthRequest & { params: { id: string } },
  res: Response<ApiResponse<{ post: Post }>>
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
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

    if (!post) {
      res.status(404).json({
        error: '게시글을 찾을 수 없습니다.'
      });
      return;
    }

    const result = {
      data: {
        post: {
          ...post,
          likesCount: post._count.likes,
          commentsCount: post._count.comments,
          isLiked: req.user ? (post.likes as any[]).length > 0 : false,
          _count: undefined as any,
          likes: undefined as any
        }
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 게시글 생성 (로그인 필수)
export const createPost = async (
  req: AuthenticatedRequest & { body: PostRequest },
  res: Response<ApiResponse<{ post: Post }>>
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

    const { title, content, image } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
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
      message: '게시글이 성공적으로 등록되었습니다.',
      data: {
        post: {
          ...post,
          likesCount: post._count.likes,
          commentsCount: post._count.comments,
          isLiked: false,
          _count: undefined as any
        }
      }
    });

  } catch (error) {
    console.error('게시글 생성 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 게시글 수정 (작성자만 가능)
export const updatePost = async (
  req: AuthenticatedRequest & { body: PostRequest; params: { id: string } },
  res: Response<ApiResponse<{ post: Post }>>
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
    const { title, content, image } = req.body;

    // 게시글 존재 및 권한 확인
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      res.status(404).json({
        error: '게시글을 찾을 수 없습니다.'
      });
      return;
    }

    if (existingPost.authorId !== req.user.id) {
      res.status(403).json({
        error: '게시글을 수정할 권한이 없습니다.'
      });
      return;
    }

    // 게시글 수정
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
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
      message: '게시글이 성공적으로 수정되었습니다.',
      data: {
        post: {
          ...updatedPost,
          likesCount: updatedPost._count.likes,
          commentsCount: updatedPost._count.comments,
          isLiked: (updatedPost.likes as any[]).length > 0,
          _count: undefined as any,
          likes: undefined as any
        }
      }
    });

  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 게시글 삭제 (작성자만 가능)
export const deletePost = async (
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;

    // 게시글 존재 및 권한 확인
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      res.status(404).json({
        error: '게시글을 찾을 수 없습니다.'
      });
      return;
    }

    if (existingPost.authorId !== req.user.id) {
      res.status(403).json({
        error: '게시글을 삭제할 권한이 없습니다.'
      });
      return;
    }

    // 게시글 삭제 (관련된 댓글, 좋아요도 CASCADE로 자동 삭제)
    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      message: '게시글이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};