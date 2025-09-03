import prisma from '../prisma-client.js';

// 상품 등록
export const createProduct = async (req, res, next) => {
  const { name, description, price, tags } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

// 상품 목록 조회
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const search = req.query.search;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: '페이지 설정이 잘못되었습니다.' });
    }

    const offset = (page - 1) * limit;
    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereCondition,
        select: { id: true, name: true, price: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      data: products,
      pagination: { page, limit, totalCount, totalPages },
    });
  } catch (error) {
    next(error);
  }
};

// 상품 상세 조회
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
};

// 상품 수정
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = price;
    if (tags !== undefined) dataToUpdate.tags = tags;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// 상품 삭제
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
