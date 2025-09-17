//src/controllers/postController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 게시글 생성
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // 필수 필드 검증
    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용은 필수 입력사항입니다.' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: req.userId // 인증 미들웨어에서 설정된 userId
      }
    });

    res.status(201).json({
      message: '게시글이 성공적으로 등록되었습니다.',
      post
    });
  } catch (error) {
    console.error('게시글 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 목록 조회
exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 상세 조회
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 로그인한 사용자가 이 게시글에 좋아요를 눌렀는지 확인
    let isLiked = false;
    if (req.userId) {
      const like = await prisma.postLike.findUnique({
        where: {
          userId_postId: {
            userId: req.userId,
            postId: parseInt(id)
          }
        }
      });
      isLiked = !!like;
    }

    res.status(200).json({
      post,
      isLiked
    });
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 수정 (소유권 확인)
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 소유권 확인
    if (post.userId !== req.userId) {
      return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' });
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content })
      }
    });

    res.status(200).json({
      message: '게시글이 성공적으로 수정되었습니다.',
      post: updatedPost
    });
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 삭제 (소유권 확인)
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 소유권 확인
    if (post.userId !== req.userId) {
      return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 좋아요
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: req.userId,
          postId: parseInt(id)
        }
      }
    });

    if (existingLike) {
      return res.status(409).json({ message: '이미 좋아요를 누른 게시글입니다.' });
    }

    await prisma.postLike.create({
      data: {
        userId: req.userId,
        postId: parseInt(id)
      }
    });

    res.status(201).json({ message: '게시글에 좋아요를 눌렀습니다.' });
  } catch (error) {
    console.error('게시글 좋아요 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 좋아요 취소
exports.unlikePost = async (req, res) => {
  try {
    const { id } = req.params;

    // 좋아요 존재 확인
    const like = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: req.userId,
          postId: parseInt(id)
        }
      }
    });

    if (!like) {
      return res.status(404).json({ message: '좋아요를 누르지 않은 게시글입니다.' });
    }

    await prisma.postLike.delete({
      where: {
        userId_postId: {
          userId: req.userId,
          postId: parseInt(id)
        }
      }
    });

    res.status(200).json({ message: '게시글 좋아요가 취소되었습니다.' });
  } catch (error) {
    console.error('게시글 좋아요 취소 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};