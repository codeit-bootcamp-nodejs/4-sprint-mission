import prisma from "../../lib/prisma.js";
import createError from "http-errors";
const deleteArticle = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        await prisma.article.delete({
            where: { id: reqId, ownerId: req.user.id },
        });
        res.status(200).json({ message: "Delete Success" });
    }
    catch (err) {
        next(err);
    }
};
export default deleteArticle;
//# sourceMappingURL=delete.article.js.map