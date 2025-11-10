import prisma from "../../lib/prisma.js";
const getArticleList = async (req, res, next) => {
    const { offset = 0, limit = 10, order = "recent", title = "", content = "", } = req.query;
    let sort = "desc";
    if (order == "recent")
        sort = "desc";
    else if (order == "lastest")
        sort = "asc";
    else
        sort = "desc";
    const resultes = await prisma.article.findMany({
        where: {
            title: { contains: String(title) },
            content: { contains: String(content) },
        },
        skip: Number(offset),
        take: Number(limit),
        orderBy: {
            createdAt: sort,
        },
    });
    res.status(200).send(resultes);
};
export default getArticleList;
//# sourceMappingURL=get.article.list.js.map