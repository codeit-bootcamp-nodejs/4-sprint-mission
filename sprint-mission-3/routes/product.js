import { PrismaClient } from "@prisma/client";
import express from "express";
import * as productValidation from "../schemas/product.js";
import * as commentValidation from "../schemas/comment.js";
import createError from "http-error";
import upload from "../middlewares/multer.js";

const router = express.Router();
const prisma = new PrismaClient();
const db = prisma.product;

//#region POST
router.post(
  "/",
  productValidation.create,
  upload.single("Image"),
  async (req, res) => {
    try {
      const product = await db.create({
        data: req.body,
      });

      if (req.file) {
        return res.status(200).json({
          message: "파일 업로드 성공",
          body: product,
          filename: req.file.filename,
          filepath: `../image/${req.file.filename}`,
        });
      }

      res.status(200).send(product);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/comments/:id",
  commentValidation.create,
  async (req, res, next) => {
    try {
      const reqId = Number(req.params.id);
      const product = await db.findUnique({ where: { id: reqId } });
      if (!product)
        return next(createError(400, "목표 데이터를 찾을 수 없습니다"));

      const result = await prisma.comment.create({
        data: {
          content: req.body.content,
          productId: reqId,
        },
      });

      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
);
//#endregion

//#region GET
router.get("/detail/:id", async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    const product = await db.findUniqueOrThrow({
      where: {
        id: reqId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
});

router.get("/list", async (req, res) => {
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

  const products = await db.findMany({
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
});

router.get("/comments/:id", async (req, res) => {
  const reqId = Number(req.params.id);
  const cursor = 1;

  if (req.query.cursor) cursor = req.query.cursor;

  const result = await db.findMany({
    where: {
      id: reqId,
    },
    select: {
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    cursor: { id: cursor },
    take: 10,
  });
  res.status(200).send(result);
});
//#endregion

//#region PATCH
router.patch("/:id", productValidation.update, async (req, res) => {
  const reqId = Number(req.params.id);

  try {
    const checkedData = Validation.UpdateProductSchema.parse(req.body);

    const product = await db.update({
      where: { id: reqId },
      data: checkedData,
    });

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/comments/:id",
  commentValidation.create,
  async (req, res, next) => {
    const reqId = Number(req.params.id);

    try {
      const result = await prisma.comment.update({
        where: { id: reqId },
        data: {
          content: req.body.content,
        },
      });

      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
);
//#endregion

//#region DELETE
router.delete("/:id", async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    await db.delete({
      where: { id: reqId },
    });

    res.status(200).json({ message: "Delete Success" });
  } catch (err) {
    next(err);
  }
});

router.delete("/comments/:id", async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    await prisma.comment.delete({
      where: { id: reqId },
    });

    res.status(200).json({ message: "Delete Success" });
  } catch (err) {
    next(err);
  }
});
//#endregion

export default router;
