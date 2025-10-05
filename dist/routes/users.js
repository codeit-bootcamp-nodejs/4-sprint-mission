import express from 'express';
import prisma from '../lib/prisma.js';
import auth from '../../src/middlewares/auth.js';
import bcrypt from 'bcrypt';
const router = express.Router();
// 내 정보 조회
router.get("/me", auth, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user });
});
// 내 정보 수정 (닉네임, 이미지 등)
router.patch("/me", auth, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { nickname, image } = req.body;
    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(nickname ? { nickname } : {}),
            ...(image ? { image } : {}),
        },
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.json({ user: updated });
});
// 비밀번호 변경
router.patch("/me/password", auth, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res
            .status(400)
            .json({ error: "currentPassword and newPassword required" });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
        return res
            .status(403)
            .json({ error: "Current password is incorrect" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
    });
    return res.json({ message: "Password updated" });
});
// 사용자가 등록한 상품 목록 조회
router.get("/me/products", auth, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const products = await prisma.product.findMany({
        where: { ownerId: userId },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.json({ products });
});
export default router;
//# sourceMappingURL=users.js.map