import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { io } from "../socket/socket.js";

const prisma = new PrismaClient();

const getProducts = async (req: Request, res: Response): Promise<void> => {
  const offset = typeof req.query.offset === "string" ? req.query.offset : "0";
  const limit = typeof req.query.limit === "string" ? req.query.limit : "10";
  const order = req.query.order === "newest" ? "asc" : "desc";
  const search = req.query.search;
  const where = search
    ? {
        OR: [
          { name: { contains: String(search), mode: "insensitive" } },
          { description: { contains: String(search), mode: "insensitive" } },
        ],
      }
    : {};
  const products = await prisma.product.findMany({
    where,
    order,
    skip: parseInt(offset, 10),
    take: parseInt(limit, 10),
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });
  res.status(200).send(products);
};

const createProducts = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;
  const { name, price } = req.body;
  const productData = {
    name,
    price,
    userId, // JWT에서 추출한 userId를 product 데이터에 추가
  };
  const products = await prisma.product.create({
    data: productData,
  });
  res.status(201).send(products);
};

const getProductsById = async (req: Request, res: Response): Promise<void> => {
  const productId = Number(req.params.productId);
  const products = await prisma.product.findUnique({
    where: { id: Number(req.params.productId) },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });
  const likeCount = await prisma.productLike.count({
    where: { productId: productId },
  });
  const Liked = likeCount > 0;
  res.status(200).json({
    products,
    Liked,
  });
};

interface ProductLike {
  userId: number;
  productId: number;
}

interface NotificationPayload {
  message: string;
  articleId?: number;
  productId?: number;
  createdAt: Date;
}

// 가격 변경 시 알림 전송 transaction
const updateProductWithNotifications = async (req: Request, res: Response) => {
  await prisma.$transaction(async (tx: PrismaClient) => {
    // 상품 정보 수정
    const updateProducts = await tx.product.update({
      where: { id: Number(req.params.productId) },
      data: req.body,
    });

    // 가격변동시
    if (req.body.price) {
      const productLike = await tx.productLike.findMany({
        where: { productId: req.params.productId },
        select: { userId: true },
      });
      const notifications = await Promise.all(
        productLike.map((like: ProductLike) =>
          tx.notification.create({
            data: {
              userId: like.userId,
              message: "내가 좋아요한 상품의 가격이 변경되었습니다.",
              productId: Number(req.params.productId),
              createdAt: new Date(),
            },
          })
        )
      );

      notifications.forEach((notif) => {
        const payload: NotificationPayload = {
          message: notif.message,
          productId: notif.productId ?? undefined,
          articleId: notif.productId ?? undefined,          
          createdAt: notif.createdAt,
        };
        io.to(`user_${notif.userId}`).emit("notification", payload);
      });
    }

    res.status(200).send(updateProducts);
  });
};

const deleteProducts = async (req: Request, res: Response): Promise<void> => {
  await prisma.product.delete({
    where: { id: Number(req.params.productId) },
  });
  res.status(204).send();
};

const getProductComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productComments = await prisma.productComment.findMany({
    where: {
      productId: req.params.productId
        ? parseInt(req.params.productId, 10)
        : undefined,
    },
  });
  res.status(200).send(productComments);
};

const createProductComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user.userId;
  const productId = req.params.productId
    ? parseInt(req.params.productId, 10)
    : undefined;
  const productComments = await prisma.productComment.create({
    data: {
      content: req.body.content,
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    },
  });
  res.status(201).send(productComments);
};

const updateProductComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productComments = await prisma.productComment.update({
    where: { id: Number(req.params.productCommentId) },
    data: req.body,
  });
  res.status(200).send(productComments);
};

const deleteProductComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productComments = await prisma.productComment.delete({
    where: { id: Number(req.params.productCommentId) },
  });
  res.status(204).send(productComments);
};

export default {
  getProducts,
  createProducts,
  getProductsById,
  updateProductWithNotifications,
  deleteProducts,
  getProductComments,
  createProductComment,
  updateProductComment,
  deleteProductComment,
};
