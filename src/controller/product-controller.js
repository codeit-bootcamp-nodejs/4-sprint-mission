import prisma from "../lib/prisma.js";

// 상품 생성 (로그인 필요)
export async function createProduct(req, res) {
  try {
    const { title, description, price, image } = req.body;
    if (!title) return res.status(400).json({ message: "title은 필수입니다." });

    const product = await prisma.product.create({
      data: {
        title,
        description: description ?? null,
        price: price ?? null,
        image: image ?? null,
        userId: req.user.id,
      },
    });
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 상품 목록 (옵션: 로그인시 isLiked 포함)
export async function listProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!req.user) {
      return res.status(200).json(products.map(p => ({ ...p, isLiked: false })));
    }

    const liked = await prisma.productLike.findMany({
      where: { userId: req.user.id, productId: { in: products.map(p => p.id) } },
      select: { productId: true },
    });
    const likedSet = new Set(liked.map(l => l.productId));
    return res.status(200).json(
      products.map(p => ({ ...p, isLiked: likedSet.has(p.id) }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 상품 단건 조회 (isLiked)
export async function getProduct(req, res) {
  try {
    const id = Number(req.params.productId);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

    let isLiked = false;
    if (req.user) {
      const like = await prisma.productLike.findUnique({
        where: {
          userId_productId: { userId: req.user.id, productId: id },
        },
      });
      isLiked = Boolean(like);
    }
    return res.status(200).json({ ...product, isLiked });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 상품 수정 (작성자만)
export async function updateProduct(req, res) {
  try {
    const id = Number(req.params.productId);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    if (product.userId !== req.user.id)
      return res.status(403).json({ message: "수정 권한이 없습니다." });

    const { title, description, price, image } = req.body;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(image !== undefined ? { image } : {}),
      },
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 상품 삭제 (작성자만)
export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.productId);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    if (product.userId !== req.user.id)
      return res.status(403).json({ message: "삭제 권한이 없습니다." });

    await prisma.product.delete({ where: { id } });
    return res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 댓글 등록 (로그인 필요)
export async function addProductComment(req, res) {
  try {
    const productId = Number(req.params.productId);
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "content는 필수입니다." });

    const exists = await prisma.product.findUnique({ where: { id: productId } });
    if (!exists) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        productId,
      },
    });
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 상품 댓글 목록
export async function listProductComments(req, res) {
  try {
    const productId = Number(req.params.productId);
    const comments = await prisma.comment.findMany({
      where: { productId },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
      },
    });
    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 댓글 수정/삭제 (작성자만)
export async function updateComment(req, res) {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    if (comment.userId !== req.user.id)
      return res.status(403).json({ message: "수정 권한이 없습니다." });

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
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

// 좋아요 / 취소
export async function likeProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    await prisma.productLike.create({
      data: { userId: req.user.id, productId },
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

export async function unlikeProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    await prisma.productLike.delete({
      where: { userId_productId: { userId: req.user.id, productId } },
    });
    return res.status(200).json({ message: "좋아요 취소" });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ message: "이미 취소됨" });
  }
}
