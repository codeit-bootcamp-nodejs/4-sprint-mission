import prisma from "../../lib/prisma.js";
import createError from "http-errors";
const updateProduct = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        const product = await prisma.product.update({
            where: { id: reqId, ownerId: req.user.id },
            data: req.body,
        });
        res.status(200).send(product);
    }
    catch (err) {
        next(err);
    }
};
export default updateProduct;
//# sourceMappingURL=update.product.js.map