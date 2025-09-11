import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getProducts = async(req, res) => {
  const { offset = '0', limit = '10', order = 'newest'} = req.query;
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = {createdAt: 'desc'};
  }
  const search = req.query.search;
  const where = search ? {
    OR: [{ name: { contains: String(search), mode: 'insensitive' } },
    { description: { contains: String(search), mode: 'insensitive' } }
    ]
  } : {};
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: parseInt(offset, 10),
    take: parseInt(limit, 10),
    select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      }
  });
  res.status(200).send(products);
};

const createProducts = async(req, res) =>  {
  const userId = req.user.userId;
  const { name, price } = req.body;
  const productData = {
    name,
    price,
    userId,   // JWT에서 추출한 userId를 product 데이터에 추가
  }  
  const products = await prisma.product.create({
    data: productData,
  });
  res.status(201).send(products);
};

const getProductsById = async(req, res) => {
  const products = await prisma.product.findUnique({
    where: { id: Number(req.params.productId) },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      }
  });
  res.status(200).send(products);
}

const updateProducts = async(req, res) => {
  const product = await prisma.product.update({
    where: { id: Number(req.params.productId) },
    data: req.body,
  });
  res.status(200).send(product);
}


const deleteProducts = async(req, res) => {
  await prisma.product.delete({
    where: { id: Number(req.params.productId) },
  });
  res.status(204).send();
}

const getProductComments = async(req, res) => {
  const productComments = await prisma.productComment.findMany({
    where: { productId: Number(req.params.productId) },
  });
  res.status(200).send(productComments);
}

const createProductComment = async(req, res) => {
  const productComments = await prisma.productComment.create({
    data: req.body,
  });
  res.status(201).send(productComments);
}

const updateProductComment = async(req, res) => {
  const productComments = await prisma.productComment.update({
    where: { id: Number(req.params.commentId) },
    data: req.body,
  });
  res.status(200).send(productComments);
}

const deleteProductComment = async(req, res) => {
  const productComments = await prisma.productComment.delete({
    where: { id: Number(req.params.commentId) },
  });
  res.status(204).send(productComments);
}

export default { 
  getProducts, 
  createProducts, 
  getProductsById, 
  updateProducts, 
  deleteProducts,
  getProductComments,
  createProductComment,
  updateProductComment,
  deleteProductComment
};