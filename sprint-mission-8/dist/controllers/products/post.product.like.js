import prisma from "../../lib/prisma.js";
import createError from "http-errors";
export default async function ProductLike(req, res, next) {
    if (!req.user) {
        return next(createError(401, "Unauthorized"));
    }
    try {
        const productId = Number(req.params.id);
        const product = await prisma.product.findUniqueOrThrow({
            where: {
                id: productId,
            },
            select: {
                likedUsers: {
                    where: {
                        id: req.user.id,
                    },
                },
            },
        });
        if (!product) {
            next(createError(404, "제품을 찾을 수 없습니다."));
        }
        if (!(product.likedUsers.length > 0)) {
            likeProduct(productId, req.user.id);
            return res
                .status(200)
                .json({ message: `${productId}번 게시을에 좋아요` });
        }
        else {
            unLikeProduct(productId, req.user.id);
            return res
                .status(200)
                .json({ message: `${productId}번 게시을에 좋아요 취소` });
        }
    }
    catch (err) {
        next(err);
    }
}
async function likeProduct(productId, userId) {
    const result = await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            likedUsers: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}
async function unLikeProduct(productId, userId) {
    const result = await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            likedUsers: {
                disconnect: {
                    id: userId,
                },
            },
        },
    });
}
//# sourceMappingURL=post.product.like.js.map