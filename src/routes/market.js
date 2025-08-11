// express 모듈을 불러와서 웹서버 라우터를 만들기 위해 사용
const express = require('express');

const { PrismaClient } = require('@prisma/client');

// PrismaClient는 데이터베이스와 쉽게 소통할 수 있게 도와주는 도구
// 이를 통해 DB에 상품이나 댓글 정보를 저장하거나 불러올 수 있다.
const asyncHandler = require('../utils/asyncHandler');

// 비동기 함수에서 발생하는 에러를 자동으로 처리해주는 함수.
// try/catch를 일일이 쓰지 않아도 에러를 잡아준다.
const { validateProductCreate, validateCommentCreate } = require('../middlewares/validate');

// 상품과 댓글을 생성할 때 입력값이 올바른지 검사하는 미들웨어.
const prisma = new PrismaClient();

// PrismaClient 인스턴스를 만들어서 DB와 연결.
const router = express.Router();
// express 라우터를 만들어서 여러 API 경로를 관리.


// '/products' 경로에 대해 POST와 GET 요청.
router.route('/products')

    // 상품 등록 API
    // POST 요청으로 상품 정보를 받아서 DB에 저장.
    // validateProductCreate 미들웨어를 통해 입력값을 검사.
    .post(validateProductCreate, asyncHandler(async (req, res) => {
        // 상품 이름, 설명, 가격, 태그, 이미지 정보를 요청 본문에서 가져온다.
        // 가격은 숫자로 변환해서 저장.
        const { name, description, price, tags = [], images = [] } = req.body;

        // prisma를 사용해 상품을 DB에 새로 만든다.
        const created = await prisma.product.create({ data: { name, description, price: Number(price), tags, images } });

        // 생성된 상품 정보를 응답으로 보내고, 상태코드 201(생성됨)을 보냄.
        res.status(201).json(created);
    }))

    // 상품 목록 조회 API
    // GET 요청으로 상품 리스트를 가져온다.
    .get(asyncHandler(async (req, res) => {

        // 쿼리 파라미터로 offset, limit, sort, q를 받습니다.
        // offset: 몇 번째 상품부터 보여줄지 (기본 0)
        // limit: 몇 개까지 보여줄지 (기본 10, 최대 100)
        // sort: 정렬 기준 (recent: 최신순, 아니면 id순)
        // q: 검색어 (공백으로 여러 단어를 받아서 이름이나 설명에 모두 포함된 상품 검색)
        const { offset = 0, limit = 10, sort = 'recent', q } = req.query;
        const skip = Number(offset) || 0;
        const take = Math.min(Number(limit) || 10, 100);

        // 검색어가 있으면 AND 조건으로 이름이나 설명에 포함되는 상품을 찾습니다.
        let where = {};
        if (q && typeof q === 'string') {
            const terms = q.split(/\s+/).filter(Boolean);
            where = {
                AND: terms.map(t => ({
                    OR: [
                        { name: { contains: t, mode: 'insensitive' } },
                        { description: { contains: t, mode: 'insensitive' } }
                    ]
                }))
            };
        }

        // 정렬 기준 설정: 최신순이면 createdAt 내림차순, 아니면 id 오름차순
        const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { id: 'asc' };

        // 상품 목록과 전체 개수를 동시에 조회합니다.
        const [items, total] = await Promise.all([
            prisma.product.findMany({
                skip, take, where, orderBy,
                select: { id: true, name: true, price: true, createdAt: true }
            }),
            prisma.product.count({ where })
        ]);

        // 조회한 상품 목록과 페이징 정보를 응답합니다.
        res.json({ items, pagination: { offset: skip, limit: take, total } });
    }));

// 상품 상세 조회, 수정, 삭제 API
router.route('/products/:id')

    // 상품 상세 조회
    // URL 파라미터로 받은 id에 해당하는 상품 정보를 가져온다.
    .get(asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({
            where: { id },
            select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true }
        });

        // 상품이 없으면 404 에러 응답
        if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

        // 상품 정보 응답
        res.json(product);
    }))


    // 상품 수정
    // PATCH 요청으로 상품 정보를 일부 수정.
    .patch(asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        const { name, description, price, tags, images } = req.body;

        try {
            // prisma의 update 메서드로 상품을 수정.
            // price가 있으면 숫자로 변환해서 저장
            const updated = await prisma.product.update({
                where: { id },
                data: { name, description, price: price !== undefined ? Number(price) : undefined, tags, images }
            });
            res.json(updated);
        } catch (e) {
            // P2025 에러는 수정할 상품이 없을 때 발생
            if (e.code === 'P2025') return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
            throw e;
        }
    }))

    // 상품 삭제
    // DELETE 요청으로 상품을 삭제.
    .delete(asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        try {
            await prisma.product.delete({ where: { id } });
            // 삭제 성공 시 204 No Content 응답 (내용 없음)
            res.status(204).send();
        } catch (e) {
            // 삭제할 상품이 없으면 404 에러 응답
            if (e.code === 'P2025') return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
            throw e;
        }
    }));



// 상품 댓글 관련 API


// 댓글 등록 API
// 특정 상품에 댓글을 작성합니다.
router.post('/products/:id/comments', validateCommentCreate, asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);
    const { content } = req.body;

    // 댓글을 달 상품이 존재하는지 확인
    const exists = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!exists) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

    // 댓글 생성
    const created = await prisma.productComment.create({ data: { productId, content } });
    res.status(201).json(created);
}));

// 댓글 목록 조회 API (커서 기반 페이징)
// 특정 상품의 댓글을 최신순으로 가져옵니다.
// 커서(cursor) 방식은 마지막으로 본 댓글 이후의 댓글을 가져오는 방식입니다.
router.get('/products/:id/comments', asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);
    const take = Math.min(Number(req.query.take) || 10, 100);
    // cursor가 있으면 해당 댓글 이후부터 조회
    const cursor = req.query.cursor ? { id: Number(req.query.cursor) } : undefined;

    const items = await prisma.productComment.findMany({
        where: { productId },
        take: take + 1, // 다음 페이지 존재 여부 확인을 위해 하나 더 가져옴
        ...(cursor ? { skip: 1, cursor } : {}), // cursor가 있으면 해당 댓글은 제외하고 다음 댓글부터 조회
        orderBy: { id: 'desc' }, // 최신 댓글부터 정렬
        select: { id: true, content: true, createdAt: true }
    });

    let nextCursor = null;
    // 만약 가져온 댓글이 요청한 개수보다 많으면 다음 페이지가 있다는 뜻
    if (items.length > take) {
        const next = items.pop(); // 마지막 댓글을 꺼내서 nextCursor로 사용
        nextCursor = next.id;
    }
    // 댓글 목록과 다음 커서 값을 응답
    res.json({ items, nextCursor });
}));

// 댓글 수정 API
// 특정 댓글 내용을 수정합니다.
router.patch('/comments/:commentId', asyncHandler(async (req, res) => {
    const id = Number(req.params.commentId);
    const { content } = req.body;

    // 내용이 없거나 빈 문자열이면 400 에러 응답
    if (!content || !content.trim()) return res.status(400).json({ error: '내용이 필요합니다.' });

    try {
        // 댓글 수정
        const updated = await prisma.productComment.update({ where: { id }, data: { content } });
        res.json(updated);
    } catch (e) {
        // 수정할 댓글이 없으면 404 에러 응답
        if (e.code === 'P2025') return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
        throw e;
    }
}));

// 댓글 삭제 API
// 특정 댓글을 삭제합니다.
router.delete('/comments/:commentId', asyncHandler(async (req, res) => {
    const id = Number(req.params.commentId);
    try {
        await prisma.productComment.delete({ where: { id } });
        // 삭제 성공 시 204 No Content 응답
        res.status(204).send();
    } catch (e) {
        // 삭제할 댓글이 없으면 404 에러 응답
        if (e.code === 'P2025') return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
        throw e;
    }
}));

module.exports = router;
// 만든 라우터를 외부에서 사용할 수 있게 내보냄.
