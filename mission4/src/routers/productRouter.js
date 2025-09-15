import express from "express";
import prisma from "../lib/prisma.js";
import passport from "../lib/passport/index.js";
import { z } from "zod";
import status from "http-status";

const router = express.Router();

// body 검증 (상품 생성/수정)
const productSchema = z.object({
  //유효성 검사 설정하기
  name: z.string().min(1, { message: "이름을 입력해주세요" }).optional(),
  description: z
    .string()
    .min(10, { message: "설명은 최소 10자 이상이어야 합니다." })
    .max(100, { message: "설명은 최대 100자까지 가능합니다." })
    .optional(),
  price: z.number().int()
  .positive({ message: "가격은 양의 정수여야 합니다." })
  .optional(),
  tags: z.string().optional().default("")
});

// query 검증 (상품 조회)
const productQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .refine((val) => val > 0, { message: "page는 1 이상의 정수여야 합니다." }),
  pageSize: z
    .string()
    .optional()
    .default("5")
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, {
      message: "pageSize는 1~100 사이여야 합니다.",
    }),
  keyword: z.string().optional().default(""),
});

router.post(
  "/products",
  passport.authenticate("access-token", { session: false }),
  createProduct
);
router.get("/products", getProducts);
router.patch(
  "/products/:id",
  passport.authenticate("access-token", { session: false }),
  modifyProduct
);
router.delete(
  "/products/:id",
  passport.authenticate("access-token", { session: false }),
  deleteProduct
);
router.get(
  "/products/:id",
  passport.authenticate("access-token", { session: false }),
  getDetailProduct
);

async function createProduct(req, res, next) {
  const parsed = productSchema.parse(req.body);
  const user = req.user;

  try {
    const product = await prisma.product.create({
      data: {
        ...parsed,
        userId: user.id,
      },
    });

    res.status(status.CREATED).json(product);
  } catch (err) {
    next(err);
  }
}

async function getProducts(req, res, next) {
  const { page, pageSize, keyword } = productQuerySchema.parse(req.query);
  const where = keyword //name과 description에서 원하는 keyword가 들어간 데이터를 찾도록 만든 변수
    ? {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive", //대소문자 구분 없이 검색하기 위해
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      }
    : {}; //기본값 {}으로 빈 객체를 수식하기 위함

  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        // 최신 순서대로 정렬하기(최신순)
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
      where,
    });

    res.status(status.OK).json(products);
  } catch (err) {
    next(err);
  }
}

async function modifyProduct(req, res, next) {
  const productId = Number(req.params.id);
  const parsed = productSchema.parse(req.body);
  const user = req.user;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Product not found" });
    }
    if (product.userId !== user.id) {
      return res.status(status.FORBIDDEN).json({ message: "User not matched" });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...parsed,
      },
    });
    res.status(status.OK).json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  const productId = Number(req.params.id);
  const user = req.user;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Product not found" });
    }
    if (product.userId !== user.id) {
      return res.status(status.FORBIDDEN).json({ message: "User not matched" });
    }

    await prisma.product.delete({
      where: { id: productId },
    });
    res.status(status.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
}

async function getDetailProduct(req, res, next) {
  const productId = Number(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });

    if (!product) {
      return res.status(status.NOT_FOUND).json({ error: "Product not found" });
    }

    res.status(status.OK).json(product);
  } catch (err) {
    next(err);
  }
}

export default router;
