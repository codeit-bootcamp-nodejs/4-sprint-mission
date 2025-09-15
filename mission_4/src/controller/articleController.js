import * as articleService from "../services/articleService.js";

export async function createPost(req, res, next) {
  const { title, content } = req.body;
  const userId = req.user.userId;

  if (!title || !content) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Required data is not sufficient";
    next(err);
  }

  try {
    const article = await articleService.createPost({ userId, title, content });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

export async function getPosts(req, res, next) {
  const { offset = 0, limit = 10, sort = "recent", search } = req.query;

  try {
    const articles = await articleService.getPosts({
      offset,
      limit,
      sort: sort === "old" ? "asc" : "desc",
      search,
    });

    if (articles) res.status(200).json(articles);
    else {
      const err = new Error();
      err.statusCode = 404;
      err.message = `Cannot find article with ID ${id}`;
      next(err);
    }
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Invalid parameter 'id'" });

  try {
    const article = await articleService.getPost(id);

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
}

export async function patchPost(req, res, next) {
  const { id } = req.params;
  if (!id) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  // Columns in model Article
  const articleCols = ["title", "content"];

  // ?
  const filteredBody = Object.entries(req.body)
    .filter((e) => articleCols.includes(e[0]))
    .reduce((obj, ele) => {
      obj[ele[0]] = ele[1];
      return obj;
    }, {});

  try {
    const article = await articleService.patchPost({ id, ...filteredBody });

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
}

export async function deletePost(req, res, next) {
  const { id } = req.params;
  if (!id) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  try {
    const deleted = await articleService.deletePost(id);

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
}

export async function postComment(req, res, next) {
  const { id: pid } = req.params;
  const { name, content } = req.body;
  const userId = req.user.userId;

  if (!name || !content || !pid) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
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
}

export async function getComments(req, res, next) {
  const { id: pid } = req.params;
  if (!pid) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id'";
    next(err);
  }

  const { cursor, limit = 10 } = req.query;

  const comments = await articleService.getComments({ pid, cursor, limit });

  if (comments)
    res.status(200).json({
      comments,
      nextCursor,
    });
  else {
    const err = new Error();
    err.statusCode = 404;
    err.message = `Cannot find any comments with board ${board}`;
    next(err);
  }
}

export async function patchComment(req, res, next) {
  const { id: pid, cid } = req.params;
  if (!pid || !cid) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id' and 'cid'";
    next(err);
  }

  const { name, content } = req.body;
  if (!name || !content) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid SQL Parameters";
    next(err);
  }

  const comment = await articleService.patchComment({
    cid,
    name,
    content,
  });

  if (comment) res.status(200).json(comment);
  else {
    const err = new Error();
    err.statusCode = 404;
    err.message = `Cannot find any comment with ID ${id}`;
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  const { id: pid, cid } = req.params;
  if (!pid || !cid) {
    const err = new Error();
    err.statusCode = 400;
    err.message = "Invalid parameter 'id' and 'cid'";
    next(err);
  }

  const deleted = await articleService.deleteComment(cid);

  if (deleted) res.status(200).json(deleted);
  else res.status(404).json({ message: `Cannot find article with ID ${id}` });
}
