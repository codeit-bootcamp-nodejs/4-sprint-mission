import * as productService from "../services/productService.js";
import type { RequestHandler } from "express";

const createProduct: RequestHandler = async function createProduct(
  req,
  res,
  next
) {
  // destructuring field data from request body
  const { name, description, price, tags } = req.body;
  const userId = req.user ? req.user.userId : null;

  if (userId === null) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  if (!name || !description || !price || !tags) {
    const err = new Error("Required data is not sufficient");
    err.statusCode = 400;
    return next(err);
  }

  try {
    // insert into Product table
    const product = await productService.createProduct({
      userId,
      name,
      description,
      price,
      tags,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const getProducts: RequestHandler = async function (req, res, next) {
  const { offset = 0, limit = 10, sort = "recent", search = "" } = req.query;

  try {
    const products = await productService.getProducts({
      offset: Number(offset),
      limit: Number(limit),
      sort: sort === "old" ? "asc" : "desc",
      search: String(search),
    });

    if (products) res.status(200).json(products);
    else {
      const err = new Error("Cannot find products");
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

const getProduct: RequestHandler = async function (req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id) || id < 0) {
    const err = new Error("Invalid parameter 'id'");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const product = await productService.getProduct({ id });

    if (product) res.status(200).json(product);
    else {
      const err = new Error(`Cannot find product with ID ${id}`);
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

const patchProduct: RequestHandler = async function (req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id) || id < 0) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  // Attributes in model Product
  const productCols = ["name", "description", "price", "tags"];

  // Possible improvement?
  const filteredBody = Object.entries(req.body)
    .filter(([key]) => productCols.includes(key))
    .reduce<Record<string, unknown>>((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  try {
    const product = await productService.patchProduct({ id, ...filteredBody });

    if (product) res.status(200).json(product);
    else {
      const err = new Error();
      err.statusCode = 404;
      err.message = `Cannot find product with ID ${id}`;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

const deleteProduct: RequestHandler = async function (req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id) || id < 0) {
    const err = new Error("Invalid parameter 'id'");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const deleted = await productService.deleteProduct({ id });

    if (deleted) res.status(200).json(deleted);
    else {
      const err = new Error(`Cannot find product with ID ${id}`);
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

const postComment: RequestHandler = async function (req, res, next) {
  const { id: pid } = req.params;
  const { name, content } = req.body;
  const userId = req.user ? req.user.userId : null;

  if (userId === null) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  // validation
  if (!name || !content || !pid) {
    const err = new Error("Required data is not sufficient");
    err.statusCode = 400;
    return next(err);
  }

  try {
    // insert into Comment table
    const comment = await productService.postComment({
      userId,
      pid: Number(pid),
      name,
      content,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const getComments: RequestHandler = async function (req, res, next) {
  const { id: pid } = req.params;
  if (!pid) {
    const err = new Error("Invalid parameter 'id'");
    err.statusCode = 400;
    return next(err);
  }

  const { cursor, limit = 10 } = req.query;

  try {
    const comments = await productService.getComments({
      pid: Number(pid),
      cursor: cursor ? Number(cursor) : null,
      limit: Number(limit),
    });

    // Cursor pagination
    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1] : null;

    if (comments)
      res.status(200).json({
        comments,
        nextCursor,
      });
    else {
      const err = new Error(`Cannot find any comments`);
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

const patchComment: RequestHandler = async function (req, res, next) {
  const { id: pid, cid } = req.params;
  const { name, content } = req.body;

  if (!pid || !cid || !name || !content) {
    const err = new Error("Invalid parameter 'id' and 'cid'");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const comment = await productService.patchComment({
      cid: Number(cid),
      name,
      content,
    });

    if (comment) res.status(200).json(comment);
    else {
      const err = new Error(`Cannot find any comment with ID ${cid}`);
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

const deleteComment: RequestHandler = async function (req, res, next) {
  const { id: pid, cid } = req.params;
  if (!pid || !cid) {
    const err = new Error("Invalid parameter 'id' and 'cid'");
    err.statusCode = 400;
    return next(err);
  }

  const deleted = await productService.deleteComment({ cid: Number(cid) });

  if (deleted) res.status(200).json(deleted);
  else {
    const err = new Error(`Cannot find product with ID ${pid}`);
    err.statusCode = 404;
    return next(err);
  }
};

const toggleLike: RequestHandler = async function (req, res, next) {
  if (!req.user) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  if (!req.params.id) {
    const err = new Error("Invalid parameter 'id'");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const userId = req.user.userId;
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      const err = new Error("Invalid product ID");
      err.statusCode = 400;
      return next(err);
    }

    const result = await productService.toggleLike(userId, productId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getProducts,
  getProduct,
  patchProduct,
  deleteProduct,
  postComment,
  getComments,
  patchComment,
  deleteComment,
  toggleLike,
};
