import { prisma } from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
// 공통 로직
export const isOwner = (modelGetter) => {
    return async (req, res, next) => {
        console.log('📌 req.params:', req.params);
        const resource = await modelGetter(req);
        console.log('📌 조회된 리소스:', resource);
        if (!resource)
            return res.status(404).json({ message: '대상을 찾을 수 없습니다.' });
        const reqUserId = req.user?.id;
        if (typeof reqUserId !== 'number') {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }
        if (resource.userId !== reqUserId)
            return res.status(403).json({ message: '권한이 없습니다.' });
        next();
    };
};
// 제품 권한 체크
export const isProductOwner = isOwner((req) => prisma.product.findUnique({
    where: { id: parseInt((req.params.id ?? ''), 10) || 0 },
    select: { userId: true },
}));
// 게시글 권한 체크
export const isArticleOwner = isOwner((req) => prisma.article.findUnique({
    where: { id: parseInt((req.params.id ?? ''), 10) || 0 },
    select: { userId: true },
}));
// 댓글 권한 체크
export const isCommentOwner = isOwner((req) => prisma.comment.findUnique({
    where: { id: parseInt((req.params.commentId ?? ''), 10) || 0 },
    select: { userId: true },
}));
// 본인인지 체크
export const isUserSelf = (req, res, next) => {
    const userIdParam = parseInt((req.params.userId ?? ''), 10);
    const reqUserId = req.user?.id;
    if (typeof reqUserId !== 'number') {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    if (Number.isNaN(userIdParam) || userIdParam !== reqUserId) {
        return res.status(403).json({ message: '권한이 없습니다.' });
    }
    next();
};
// 비밀번호 체크
export const verifyPassword = async (req, res, next) => {
    try {
        const { currentPassword } = req.body;
        if (!currentPassword) {
            return res
                .status(400)
                .json({ message: '현재 비밀번호를 입력해 주세요.' });
        }
        const reqUserId = req.user?.id;
        if (typeof reqUserId !== 'number') {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }
        const user = await prisma.user.findUnique({ where: { id: reqUserId } });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=authorize.js.map