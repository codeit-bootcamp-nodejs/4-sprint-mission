import prisma from "../../lib/prisma.js";
import createError from "http-errors";
const createArticleComment = async (req, res, next) => {
    try {
        const reqId = Number(req.params.id);
        if (!req.user) {
            return next(createError(401, "Unauthorized"));
        }
        const article = await prisma.article.findUnique({
            where: { id: reqId, ownerId: req.user.id },
        });
        if (!article)
            return next(createError(400, "목표 데이터를 찾을 수 없습니다"));
        const result = await prisma.comment.create({
            data: {
                content: req.body.content,
                articleId: reqId,
                ownerId: req.user.id,
            },
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
export default createArticleComment;
//# sourceMappingURL=post.article.comment.create.js.map