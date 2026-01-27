import { prisma } from "../prisma/client.js";
import { UpdateMeDto, ChangePasswordDto } from "../validations/schemas.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";

function stripUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

// 내 정보 조회
export async function getMe(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  return res.json(stripUser(user));
}

// 내 정보 수정
export async function updateMe(req, res) {
  const body = UpdateMeDto.parse(req.body);
  const user = await prisma.user.update({ where: { id: req.user.id }, data: body });
  return res.json(stripUser(user));
}

// 비밀번호 변경
export async function changePassword(req, res) {
  const body = ChangePasswordDto.parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  const ok = await verifyPassword(body.currentPassword, user.password);
  if (!ok) return res.status(400).json({ message: "현재 비밀번호가 일치하지 않습니다." });

  const newHash = await hashPassword(body.newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { password: newHash } });

  return res.json({ message: "비밀번호가 변경되었습니다." });
}

// 내가 등록한 상품 목록
export async function myProducts(req, res) {
  const products = await prisma.product.findMany({ where: { userId: req.user.id } });
  return res.json(products);
}

// 내가 좋아요한 상품 목록
export async function likedProducts(req, res) {
  const likes = await prisma.productLike.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });
  return res.json(likes.map((l) => l.product));
}

// 내가 좋아요한 게시글 목록
export async function likedPosts(req, res) {
  const likes = await prisma.postLike.findMany({
    where: { userId: req.user.id },
    include: { post: true },
  });
  return res.json(likes.map((l) => l.post));
}
