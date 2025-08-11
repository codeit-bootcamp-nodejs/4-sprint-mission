// 자유게시판(articles) 라우터
// - 이 파일은 /api/board 아래에서 사용됩니다. (app.js에서 app.use('/api/board', router2))

const express2 = require('express');
// PrismaClient를 불러오는데, 변수 이름 충돌을 피하려고 별칭(PrismaClient2)으로 가져옵니다.
const { PrismaClient: PrismaClient2 } = require('@prisma/client');
// 비동기 라우터 함수에서 try/catch 대신 에러를 next로 넘겨주는 래퍼
const asyncHandler2 = require('../utils/asyncHandler');
// 요청 본문 검증(제목/내용, 댓글 내용 등)
const { validateArticleCreate, validateCommentCreate: validateCommentCreate2 } = require('../middlewares/validate');

// DB에 접속하기 위한 Prisma 클라이언트 인스턴스
const prisma2 = new PrismaClient2();
// 익스프레스 라우터 인스턴스
const router2 = express2.Router();

/**
 * /articles
 * - POST: 게시글 등록
 * - GET : 게시글 목록(오프셋 페이지네이션 + 검색 + 정렬)
 */
router2.route('/articles')
    .post(
        // 제목/내용 검증 미들웨어 → 실패 시 400 응답
        validateArticleCreate,
        // 실제 처리 로직 (에러는 asyncHandler2가 잡아줌)
        asyncHandler2(async (req, res) => {
            const { title, content } = req.body;
            // 게시글 생성
            const created = await prisma2.article.create({ data: { title, content } });
            // 생성 성공 → 201
            res.status(201).json(created);
        })
    )
    .get(
        asyncHandler2(async (req, res) => {
            // offset/limit: 오프셋 페이지네이션
            // sort=recent: 최신순
            // q: 검색어 (공백으로 여러 단어 가능, AND 조건)
            const { offset = 0, limit = 10, sort = 'recent', q } = req.query;
            const skip = Number(offset) || 0;
            const take = Math.min(Number(limit) || 10, 100); // 과도한 요청 방지

            // 검색 조건 만들기
            // "맥북 팁" → ["맥북","팁"] 각각 title 또는 content에 포함(대소문자 무시)
            let where = {};
            if (q && typeof q === 'string') {
                const terms = q.split(/\s+/).filter(Boolean);
                where = {
                    AND: terms.map(t => ({
                        OR: [
                            { title: { contains: t, mode: 'insensitive' } },
                            { content: { contains: t, mode: 'insensitive' } }
                        ]
                    }))
                };
            }

            // 정렬: recent면 createdAt 내림차순, 아니면 id 오름차순(기본)
            const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { id: 'asc' };

            // 목록과 전체 개수를 동시에 조회 (응답에 total 포함)
            const [items, total] = await Promise.all([
                prisma2.article.findMany({
                    skip,
                    take,
                    where,
                    orderBy,
                    select: { id: true, title: true, content: true, createdAt: true } // 목록에 필요한 필드만
                }),
                prisma2.article.count({ where })
            ]);

            // 페이지 정보와 함께 응답
            res.json({ items, pagination: { offset: skip, limit: take, total } });
        })
    );

/**
 * /articles/:id
 * - GET   : 게시글 상세
 * - PATCH : 게시글 수정
 * - DELETE: 게시글 삭제
 */
router2.route('/articles/:id')
    .get(
        asyncHandler2(async (req, res) => {
            const id = Number(req.params.id);
            // 상세 조회: 존재하지 않으면 null
            const article = await prisma2.article.findUnique({
                where: { id },
                select: { id: true, title: true, content: true, createdAt: true }
            });
            if (!article) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
            res.json(article);
        })
    )
    .patch(
        asyncHandler2(async (req, res) => {
            const id = Number(req.params.id);
            const { title, content } = req.body;
            try {
                // 존재하지 않는 id면 Prisma가 P2025 에러를 던짐 아래 catch에서 404 처리
                const updated = await prisma2.article.update({ where: { id }, data: { title, content } });
                res.json(updated);
            } catch (e) {
                if (e.code === 'P2025') return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
                throw e; // 그 외 에러는 글로벌 에러 핸들러로
            }
        })
    )
    .delete(
        asyncHandler2(async (req, res) => {
            const id = Number(req.params.id);
            try {
                await prisma2.article.delete({ where: { id } });
                // 삭제 성공 시 본문 없이 204
                res.status(204).send();
            } catch (e) {
                if (e.code === 'P2025') return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
                throw e;
            }
        })
    );

// 경로: /articles/:id/comments  (특정 게시글의 댓글)
router2.post(
    '/articles/:id/comments',
    // 댓글 내용 검증
    validateCommentCreate2,
    asyncHandler2(async (req, res) => {
        const articleId = Number(req.params.id);
        const { content } = req.body;

        // 부모 게시글 존재 확인 (없으면 404)
        const exists = await prisma2.article.findUnique({ where: { id: articleId }, select: { id: true } });
        if (!exists) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

        // 댓글 생성
        const created = await prisma2.articleComment.create({ data: { articleId, content } });
        res.status(201).json(created);
    })
);

// 댓글 목록: 커서 기반 페이지네이션
router2.get(
    '/articles/:id/comments',
    asyncHandler2(async (req, res) => {
        const articleId = Number(req.params.id);
        const take = Math.min(Number(req.query.take) || 10, 100); // 한 번에 가져올 개수
        const cursor = req.query.cursor ? { id: Number(req.query.cursor) } : undefined;

        // 커서 방식: 정렬 기준이 되는 고유값(id)를 기억했다가 다음 페이지를 이어서 조회
        const items = await prisma2.articleComment.findMany({
            where: { articleId },
            take: take + 1,              // 다음 페이지가 있는지 확인하기 위해 한 개 더 가져옴
            ...(cursor ? { skip: 1, cursor } : {}), // cursor가 있으면 그 다음부터
            orderBy: { id: 'desc' },     // 최신 댓글 먼저
            select: { id: true, content: true, createdAt: true }
        });

        // 다음 페이지가 있으면 nextCursor 설정
        let nextCursor = null;
        if (items.length > take) {
            const next = items.pop(); // 한 개 덜어내고
            nextCursor = next.id;     // 그 id를 다음 커서로 사용
        }
        res.json({ items, nextCursor });
    })
);

// 댓글 수정
router2.patch(
    '/comments/:commentId',
    asyncHandler2(async (req, res) => {
        const id = Number(req.params.commentId);
        const { content } = req.body;

        // 내용이 비었으면 400
        if (!content || !content.trim()) return res.status(400).json({ error: '내용이 필요합니다.' });

        try {
            const updated = await prisma2.articleComment.update({ where: { id }, data: { content } });
            res.json(updated);
        } catch (e) {
            // 없는 댓글이면 404
            if (e.code === 'P2025') return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
            throw e;
        }
    })
);

// 댓글 삭제
router2.delete(
    '/comments/:commentId',
    asyncHandler2(async (req, res) => {
        const id = Number(req.params.commentId);
        try {
            await prisma2.articleComment.delete({ where: { id } });
            res.status(204).send();
        } catch (e) {
            if (e.code === 'P2025') return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
            throw e;
        }
    })
);

// 라우터를 외부에서 사용할 수 있게 내보냄
module.exports = router2;