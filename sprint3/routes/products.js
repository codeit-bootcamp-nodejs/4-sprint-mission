import express from "express";
import { PrismaClient } from "@prisma/client";
import commentProductRouter from "./productComments.js";
import { validateProdCreate, validateId, validateProdUpdate, validateProdQuery } from "../middlewares/validate.js";

const productRouter = express.Router();

const prisma = new PrismaClient();

productRouter.use(express.json());

productRouter
  .route("/")
  .get(validateProdQuery, async (req, res, next) => {
    const { offset = 0, limit = 10, name, description } = req.query;

    const filter = [];

    if (name) {
      filter.push({ name: { contains: name } });
    }

    if (description) {
      filter.push({ description: { contains: description } });
    }

    const where = filter.length > 0 ? { AND: filter } : {};

    try {
      const product = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: parseInt(offset, 10),
        take: parseInt(limit, 10),
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      });
      if (product.length === 0) {
        return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
      }

      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  })
  .post(validateProdCreate, async (req, res, next) => {
    const { name, description, price, tags } = req.body;

    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          tags,
        },
      });

      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  });

productRouter
  .route("/:id")
  .get(validateId, async (req, res, next) => {
    const id = Number(req.params.id);

    try {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
      }

      res.json(product);
    } catch (err) {
      next(err);
    }
  })

  .patch(validateId, validateProdUpdate, async (req, res, next) => {
    const id = Number(req.params.id);
    const { name, description, price, tags } = req.body;

    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price }),
          ...(tags !== undefined && { tags }),
        },
      });

      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  })

  .delete(validateId, async (req, res, next) => {
    const id = Number(req.params.id);

    try {
      await prisma.product.delete({ where: { id } });

      res.status(200).json({ message: `${id} 삭제 완료` });
    } catch (err) {
      next(err);
    }
  });

productRouter.use("/", commentProductRouter);

export default productRouter;
