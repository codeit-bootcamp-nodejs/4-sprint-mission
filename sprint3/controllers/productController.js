import {
  getProducts,
  createProduct,
  findProductById,
  updateProduct,
  removeProduct,
} from "../services/productService.js";

export const getProductList = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, name, description } = req.query;

    const product = await getProducts(offset, limit, name, description);

    if (product.length === 0) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const postProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const userId = req.user.id;

    const product = await createProduct(name, description, price, tags, userId);

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const product = await findProductById(id);

    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const patchProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const { name, description, price, tags } = req.body;

    const product = await updateProduct(
      id,
      name,
      description,
      price,
      tags,
      userId
    );

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const deletProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    await removeProduct(id, userId);

    res.status(200).json({ message: `${id} 삭제 완료` });
  } catch (err) {
    next(err);
  }
};
