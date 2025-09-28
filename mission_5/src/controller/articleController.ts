import * as articleService from "../services/articleService.js";
import type { RequestHandler } from "express";

const createPost: RequestHandler = async function (req, res, next) {
  const { title, content } = req.body;

  const userId = req.user ? req.user.userId : null;
  if (userId === null) {
    const err = new Error("Access token is missing or invalid");
    err.statusCode = 401;
    return next(err);
  }

  if (!title || !content) {
    const err = new Error("Required data is not sufficient");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const article = await articleService.createPost({ userId, title, content });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

const getPosts: RequestHandler = async function (req, res, next) {
  const { offset = 0, limit = 10, sort = "recent", search } = req.query;

  try {
    const articles = await articleService.getPosts({
      offset: Number(offset),
      limit: Number(limit),
      sort: sort === "old" ? "asc" : "desc",
      search: String(search),
    });

    if (articles) res.status(200).json(articles);
    else {
      const err = new Error();
      err.statusCode = 404;
      err.message = `Cannot find article with given parameters`;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

const getPost: RequestHandler = async function (req, res, next) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Invalid parameter 'id'" });

  try {
    const article = await articleService.getPost({ id: Number(id) });

    if (article) res.status(200).json(article);
    else {
      const err = new Error(`Cannot find article with ID ${id}`);
      err.statusCode = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

const patchPost: RequestHandler = async function (req, res, next) {
  const { id } = req.params;
  if (!id) {
    const err = new Error("Invalid parameter 'id'");
    err.statusCode = 400;
    return next(err);
  }

  // Columns in model Article
  const articleCols = ["title", "content"];

  // ?
  const filteredBody = Object.entries(req.body)
    .filter(([key]) => articleCols.includes(key))
    .reduce<Record<string, unknown>>((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  try {
    const article = await articleService.patchPost({
      id: Number(id),
      ...filteredBody,
    });

    if (article) res.status(200).json(article);
    else {
      const err = new Error();
      err.statusCode = 404;
      err.message = `Cannot find article with ID ${id}`;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

const deletePost: RequestHandler = async function (req, res, next) {
  const { id } = req.params;
  if (!id) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  try {
    const deleted = await articleService.deletePost({ id: Number(id) });

    if (deleted) res.status(200).json(deleted);
    else {
      const err = new Error();
      err.statusCode = 404;
      err.message = `Cannot find article with ID ${id}`;
      next(err);
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
    const err = new Error("Access token is missing or invalid");
    err.statusCode = 401;
    return next(err);
  }

  if (!name || !content || !pid) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    return next(err);
  }

  try {
    const comment = await articleService.postComment({
      userId,
      name,
      content,
      pid: Number(pid),
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const getComments: RequestHandler = async function (req, res, next) {
  const { id: pid } = req.params;
  if (!pid) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    return next(err);
  }

  const { cursor, limit = 10 } = req.query;

  const comments = await articleService.getComments({
    pid: Number(pid),
    cursor: Number(cursor),
    limit: Number(limit),
  });

  if (comments)
    res.status(200).json({
      comments,
      nextCursor:
        comments.length === Number(limit) ? comments.at(-1)?.id : null, // llm
    });
  else {
    const err = new Error();
    err.statusCode = 404;
    err.message = `Cannot find any comments with id ${pid}`;
    return next(err);
  }
};

const patchComment: RequestHandler = async function (req, res, next) {
  const { id: pid, cid } = req.params;
  if (!pid || !cid) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id' and 'cid'";
    return next(err);
  }

  const { name, content } = req.body;
  if (!name || !content) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid SQL Parameters";
    return next(err);
  }

  const comment = await articleService.patchComment({
    cid: Number(cid),
    name,
    content,
  });

  if (comment) res.status(200).json(comment);
  else {
    const err = new Error();
    err.statusCode = 404;
    err.message = `Cannot find any comment with ID ${pid}`;
    return next(err);
  }
};

const deleteComment: RequestHandler = async function (req, res, next) {
  const { id: pid, cid } = req.params;
  if (!pid || !cid) {
    const err = new Error("Invalid parameter 'id' and 'cid'");
    err.statusCode = 400;
    return next(err);
  }

  const deleted = await articleService.deleteComment({ cid: Number(cid) });

  if (deleted) res.status(200).json(deleted);
  else {
    const err = new Error(`Cannot find any comment with ID ${cid}`);
    err.statusCode = 404;
    return next(err);
  }
};

export {
  createPost,
  getPosts,
  getPost,
  patchPost,
  deletePost,
  postComment,
  getComments,
  patchComment,
  deleteComment,
};
