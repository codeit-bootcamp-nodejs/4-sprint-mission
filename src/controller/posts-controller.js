import prisma from "../lib/prisma.js";

// 게시글 생성
export async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: "title, content는 필수입니다." });

    const post = await prisma.post.create({
      data: { title, content, userId: req.user.id },
    });
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 게시글 목록 (isLiked)
export async function listPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!req.user) {
      return res.status(200).json(posts.map(p => ({ ...p, isLiked: false })));
    }
    const liked = await prisma.postLike.findMany({
      where: { userId: req.user.id, postId: { in: posts.map(p => p.id) } },
      select: { postId: true },
    });
    const likedSet = new Set(liked.map(l => l.postId));
    return res.status(200).json(posts.map(p => ({ ...p, isLiked: likedSet.has(p.id) })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 게시글 단건
export async function getPost(req, res) {
  try {
    const id = Number(req.params.postId);
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    let isLiked = false;
    if (req.user) {
      const like = await prisma.postLike.findUnique({
        where: { userId_postId: { userId: req.user.id, postId: id } },
      });
      isLiked = Boolean(like);
    }
    return res.status(200).json({ ...post, isLiked });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 수정/삭제 (작성자만)
export async function updatePost(req, res) {
  try {
    const id = Number(req.params.postId);
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    if (post.userId !== req.user.id)
      return res.status(403).json({ message: "수정 권한이 없습니다." });

    const { title, content } = req.body;
    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
      },
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

export async function deletePost(req, res) {
  try {
    const id = Number(req.params.postId);
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    if (post.userId !== req.user.id)
      return res.status(403).json({ message: "삭제 권한이 없습니다." });

    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 댓글
export async function addPostComment(req, res) {
  try {
    const postId = Number(req.params.postId);
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "content는 필수입니다." });

    const exists = await prisma.post.findUnique({ where: { id: postId } });
    if (!exists) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    const comment = await prisma.comment.create({
      data: { content, userId: req.user.id, postId },
    });
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

export async function listPostComments(req, res) {
  try {
    const postId = Number(req.params.postId);
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, nickname: true, image: true } } },
    });
    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 댓글 수정/삭제 (작성자만) — products-controller와 공용으로 써도 됨
export async function updateComment(req, res) {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    if (comment.userId !== req.user.id)
      return res.status(403).json({ message: "수정 권한이 없습니다." });

    const updated = await prisma.comment.update({ where: { id: commentId }, data: { content } });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}
export async function deleteComment(req, res) {
  try {
    const commentId = Number(req.params.commentId);
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    if (comment.userId !== req.user.id)
      return res.status(403).json({ message: "삭제 권한이 없습니다." });

    await prisma.comment.delete({ where: { id: commentId } });
    return res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 좋아요
export async function likePost(req, res) {
  try {
    const postId = Number(req.params.postId);
    await prisma.postLike.create({
      data: { userId: req.user.id, postId },
    });
    return res.status(200).json({ message: "좋아요" });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(200).json({ message: "이미 좋아요 상태" });
    }
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}
export async function unlikePost(req, res) {
  try {
    const postId = Number(req.params.postId);
    await prisma.postLike.delete({
      where: { userId_postId: { userId: req.user.id, postId } },
    });
    return res.status(200).json({ message: "좋아요 취소" });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ message: "이미 취소됨" });
  }
}
