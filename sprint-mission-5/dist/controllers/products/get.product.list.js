import prisma from "../../lib/prisma.js";
const getProductList = async (req, res, next) => {
    const { offset = 0, limit = 10, order = "recent", name = "", description = "", } = req.query;
    let sort = "desc";
    if (order == "recent")
        sort = "desc";
    else if (order == "lastest")
        sort = "asc";
    else
        sort = "desc";
    try {
        const products = await prisma.product.findMany({
            where: {
                name: { contains: String(name) },
                description: { contains: String(description) },
            },
            skip: Number(offset),
            take: Number(limit),
            orderBy: {
                updateAt: sort,
            },
        });
        res.status(200).send(products);
    }
    catch (err) {
        next(err);
    }
};
export default getProductList;
//# sourceMappingURL=get.product.list.js.map