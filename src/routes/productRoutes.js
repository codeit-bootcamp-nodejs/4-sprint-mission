import express from "express";
import prisma from '../lib/prisma.js';
import auth from '../../dist/middlewares/auth.js';
const router = express.Router();
// [Post] 상품 등록
router.post("/", auth, async (req, res) => {
    try {
        const { name, description, price, tags } = req.body;
        // 유효성 검사
        if (!name || !price) {
            return res.status(400).json({ message: "상품명과 가격은 필수 입력값입니다. " });
        }
        //DB에 상품 생성
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                tags,
            },
            select: { id: true, name: true, description: true, price: true, ownerId: true, createdAt: true, updatedAt: true }
        });
        return res.status(201).json({
            message: "상품이 성공적으로 등록되었습니다.",
            product: newProduct,
        });
    }
    catch (err) {
        console.error("상품 등록 오류: ", err);
        return res.status(500).json({ message: "상품 등록 실패", error: err.message });
    }
});
// [Get] 상품 상세 조회
router.get("/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
        }
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }
        return res.status(200).json(product);
    }
    catch (err) {
        console.error("상품 상세 조회 오류:", err);
        return res.status(500).json({ message: "상품 상세 조회 실패", error: err.message });
    }
});
// [Patch] 상품 수정
router.patch("/:id", auth, async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const { name, description, price, tags, status } = req.body;
        if (isNaN(productId)) {
            return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
        }
        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
        if (!existingProduct) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }
        const updateProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: name ?? existingProduct.name,
                description: description ?? existingProduct.description,
                price: price !== undefined ? Number(price) : existingProduct.price,
                tags: tags ?? existingProduct.tags,
                status: status ?? existingProduct.status,
            },
        });
        return res.status(200).json({ message: "상품이 성공적으로 수정되었습니다.", product: updateProduct });
    }
    catch (err) {
        console.error("상품 수정 오류:", err);
        return res.status(500).json({ message: "상품 수정 실패", error: err.message });
    }
});
// [DELETE] 상품 삭제
router.delete("/:id", auth, async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
        }
        await prisma.product.delete({ where: { id: productId } });
        return res.status(200).json({ message: "상품이 삭제되었습니다." });
    }
    catch (err) {
        console.error("상품 삭제 오류", err);
        return res.status(500).json({ message: "상품 삭제 실패", error: err.message });
    }
});
// [GET] 상품 목록 조회
router.get("/", async (req, res) => {
    try {
        const { offset = 0, limit = 10, search = "", sort = "recent" } = req.query;
        const whereCondition = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const orderOption = sort === "recent" ? { createdAt: "desc" } : {};
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    createdAt: true,
                },
                orderBy: orderOption,
                skip: Number(offset),
                take: Number(limit),
            }),
            prisma.product.count({ where: whereCondition }),
        ]);
        return res.status(200).json({
            totalCount,
            offset: Number(offset),
            limit: Number(limit),
            products,
        });
    }
    catch (err) {
        console.error("상품 목록 조회 오류:", err);
        return res.status(500).json({ message: "상품 목록 조회 실패", error: err.message });
    }
});
export default router;
//# sourceMappingURL=productRoutes.js.map