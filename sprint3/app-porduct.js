import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateProduct, PatchProduct, ProductComment, PatchProductComment } from './zod.js';
import { ZodError } from 'zod';
import multer from 'multer';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    }
    catch (e) {
      if (e instanceof ZodError) {
          res.status(400).json({ message: e.message, issues: e.errors });
        } else if (e.name === 'StructError' || 
                   e.name === 'ValidationError' ||
                   e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError && 
        e.code === 'P2025') {
        res.status(404).send();
      } else {
        console.error(e);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    }
  };
};


app.route('/products')
.get(asyncHandler(async(req, res) => {
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
}))
.post(asyncHandler(async(req, res) => {
  const validated = CreateProduct.parse(req.body);
  const products = await prisma.product.create({
    data: validated,
  });
  res.status(201).send(products);
}))
.get(asyncHandler(async(req, res) => {
  const { limit = '10'} = req.query;
  const cursor = req.query.cursor ? { id: String(req.query.cursor) } : undefined;
  const productComments = await prisma.productComment.findMany({
    cursor,
    take: parseInt(limit, 10),
    select: {
        id: true,
        content: true,
        createdAt: true,
      }
  });
  res.status(200).send(productComments);
}))
.post(asyncHandler(async(req, res) => {
  const validated = ProductComment.parse(req.body);
  const productComments = await prisma.productComment.create({
    data: validated,
  });
  res.status(201).send(productComments);
}))

app.route('/products/:id')
.get(asyncHandler(async(req, res) => {
  const products = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!products) {
    return res.status(404).send();
  }
  res.status(200).send(products);
}))
.patch(asyncHandler(async(req, res) => {
  const validated = PatchProduct.parse(req.body);
  const products = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: validated,
  });
  res.status(200).send(products);
}))
.delete(asyncHandler(async(req, res) => {
  await prisma.product.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).send();
}))
.patch(asyncHandler(async(req, res) => {
  const validated = PatchProductComment.parse(req.body);
  const productComments = await prisma.productComment.update({
    where: { id: Number(req.params.id) },
    data: validated,
  });
  res.status(200).send(productComments);
}))
.delete(asyncHandler(async(req, res) => {
  await prisma.productComment.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).send();
}));

const uploads = multer({ dest: 'uploads/products' });

app.post('/products/files', uploads.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.status(201).send({ message: 'File uploaded successfully', file });
}));

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});