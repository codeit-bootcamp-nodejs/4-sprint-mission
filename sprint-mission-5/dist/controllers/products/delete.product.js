import prisma from "../../lib/prisma.js";
import createError from "http-errors";
const deleteProduct = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        await prisma.product.delete({
            where: { id: reqId, ownerId: req.user.id },
        });
        res.status(200).json({ message: "Delete Success" });
    }
    catch (err) {
        next(err);
    }
};
export default deleteProduct;
//# sourceMappingURL=delete.product.js.map