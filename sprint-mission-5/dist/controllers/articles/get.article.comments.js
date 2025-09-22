import prisma from "../../lib/prisma.js";
const getArticleComment = async (req, res, next) => {
    const reqId = Number(req.params.id);
    let cursor = 1;
    try {
        if (req.query.cursor)
            cursor = Number(req.query.cursor);
        const result = await prisma.article.findMany({
            where: {
                id: reqId,
            },
            select: {
                comments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            cursor: { id: cursor },
            take: 10,
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
export default getArticleComment;
//# sourceMappingURL=get.article.comments.js.map