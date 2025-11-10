import createError from "http-errors";
import prisma from "../../lib/prisma.js";
export default async function getLikeProducts(req, res, next) {
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        const product = await prisma.user.findUniqueOrThrow({
            where: {
                id: req.user.id,
            },
            select: {
                likeProducts: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const result = product.likeProducts;
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=get.like.products.js.map