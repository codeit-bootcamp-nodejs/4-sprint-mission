import prisma from "../../lib/prisma.js";
import createError from "http-errors";
const updateArticle = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        const result = await prisma.article.update({
            where: { id: reqId, ownerId: req.user.id },
            data: req.body,
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
export default updateArticle;
//# sourceMappingURL=update.article.js.map