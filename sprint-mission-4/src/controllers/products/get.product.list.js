import prisma from "../../../lib/prisma.js";

const getProductList = async (req, res) => {
  const {
    offset = 0,
    limit = 10,
    order = "recent",
    name = "",
    description = "",
  } = req.query;

  let sort;
  if (order == "recent") sort = "desc";
  else if (order == "lastest") sort = "asc";
  else sort = "desc;";

  const products = await prisma.product.findMany({
    where: {
      name: { contains: name },
      description: { contains: description },
    },
    skip: Number(offset),
    take: Number(limit),
    orderBy: {
      updateAt: sort,
    },
  });

  res.status(200).send(products);
};

export default getProductList;
