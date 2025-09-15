import * as productService from "../services/productService.js";

export async function createProduct(req, res, next) {
  // destructuring field data from request body
  const { name, description, price, tags } = req.body;
  const userId = req.user.userId;

  if (!name || !description || !price || !tags) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Required data is not sufficient";
    next(err);
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
}

export async function getProducts(req, res, next) {
  const { offset = 0, limit = 10, sort = "recent", search = "" } = req.query;

  try {
    const products = await productService.getProducts({
      offset: Number(offset),
      limit: Number(limit),
      sort: sort === "old" ? "asc" : "desc",
      search,
    });

    if (products) res.status(200).json(products);
    else {
      const err = new Error();
      err.statusCode = 404;
      err.message = `Cannot find products`;
      next(err);
    }
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  const { id } = req.params;
  if (isNaN(id) || parseInt(id) < 0) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  try {
    const product = await productService.getProduct(Number(id));

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
}

export async function patchProduct(req, res, next) {
  const { id } = req.params;
  if (isNaN(id) || parseInt(id) < 0) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  // Attributes in model Product
  const productCols = ["name", "description", "price", "tags"];

  // Possible improvement?
  const filteredBody = Object.entries(req.body)
    .filter((e) => productCols.includes(e[0]))
    .reduce((obj, ele) => {
      obj[ele[0]] = ele[1];
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
}

export async function deleteProduct(req, res, next) {
  const { id } = req.params;
  if (isNaN(id) || parseInt(id) < 0) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  try {
    const deleted = await productService.deleteProduct(id);

    if (deleted) res.status(200).json(deleted);
    else {
      const err = new Error();
      err.statusCode = 404;
      err.message = `Cannot find product with ID ${id}`;
      next(err);
    }
  } catch (err) {
    next(err);
  }
}

export async function postComment(req, res, next) {
  const { id: pid } = req.params;
  const { name, content } = req.body;
  const userId = req.user.userId;

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
}

export async function getComments(req, res, next) {
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
      cursor,
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
      const err = new Error(`Cannot find any comments with board ${board}`);
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
}

export async function patchComment(req, res, next) {
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
      const err = new Error(`Cannot find any comment with ID ${id}`);
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  const { id: pid, cid } = req.params;
  if (!pid || !cid) {
    const err = new Error("Invalid parameter 'id' and 'cid'");
    err.statusCode = 400;
    return next(err);
  }

  const deleted = await productService.deleteComment(Number(cid));

  if (deleted) res.status(200).json(deleted);
  else {
    const err = new Error(`Cannot find product with ID ${id}`);
    err.statusCode = 404;
    return next(err);
  }
}
