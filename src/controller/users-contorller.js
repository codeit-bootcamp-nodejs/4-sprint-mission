import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// 내 정보 조회
export async function getMe(req, res) {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, nickname: true, image: true,
        createdAt: true, updatedAt: true,
      },
    });
    return res.status(200).json(me);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 내 정보 수정
export async function updateMe(req, res) {
  try {
    const { nickname, image } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(nickname ? { nickname } : {}),
        ...(image !== undefined ? { image } : {}),
      },
      select: {
        id: true, email: true, nickname: true, image: true,
        createdAt: true, updatedAt: true,
      },
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 비밀번호 변경
export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "oldPassword, newPassword는 필수입니다." });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(401).json({ message: "기존 비밀번호가 올바르지 않습니다." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });
    return res.status(200).json({ message: "비밀번호가 변경되었습니다." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 내가 등록한 상품 목록
export async function getMyProducts(req, res) {
  try {
    const items = await prisma.product.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 내가 좋아요한 상품 목록
export async function getMyLikedProducts(req, res) {
  try {
    const likes = await prisma.productLike.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(likes.map(l => l.product));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// (옵션) 내가 좋아요한 게시글 목록
export async function getMyLikedPosts(req, res) {
  try {
    const likes = await prisma.postLike.findMany({
      where: { userId: req.user.id },
      include: { post: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(likes.map(l => l.post));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}
