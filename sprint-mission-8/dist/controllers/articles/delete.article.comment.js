import prisma from "../../lib/prisma.js";
import creaetError from "http-errors";
const deleteArticleComment = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next(creaetError(401, "Unauthorized"));
    }
    try {
        await prisma.comment.delete({
            where: { id: reqId, ownerId: req.user.id },
        });
        res.status(200).json({ message: "Delete Success" });
    }
    catch (err) {
        next(err);
    }
};
export default deleteArticleComment;
//# sourceMappingURL=delete.article.comment.js.map