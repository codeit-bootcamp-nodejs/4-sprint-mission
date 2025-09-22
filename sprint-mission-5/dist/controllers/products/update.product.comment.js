import prisma from "../../lib/prisma.js";
import createError from "http-errors";
const updateProductComment = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        const result = await prisma.comment.update({
            where: { id: reqId, ownerId: req.user.id },
            data: {
                content: req.body.content,
            },
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
export default updateProductComment;
//# sourceMappingURL=update.product.comment.js.map