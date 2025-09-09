import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UsersController {
  // 내 정보 조회
  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          nickname: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "내 정보 조회 실패" });
    }
  }

  // 내 정보 수정
  async updateProfile(req, res) {
    const { nickname, image } = req.body;
    try {
      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: { nickname, image },
        select: {
          id: true,
          email: true,
          nickname: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "내 정보 수정 실패" });
    }
  }

  // 비밀번호 변경
  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: "유저 없음" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: "기존 비밀번호 불일치" });

      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashed },
      });

      res.json({ message: "비밀번호 변경 완료" });
    } catch (err) {
      res.status(500).json({ error: "비밀번호 변경 실패" });
    }
  }

  // 내가 등록한 상품 목록
  async getMyProducts(req, res) {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    try {
      const products = await prisma.product.findMany({
        where: { userId: req.user.id },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
      });

      const total = await prisma.product.count({ where: { userId: req.user.id } });

      res.json({
        data: products,
        pagination: {
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (err) {
      res.status(500).json({ error: "내 상품 목록 조회 실패" });
    }
  }
}
