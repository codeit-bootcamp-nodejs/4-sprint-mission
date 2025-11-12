import prisma from "../lib/prisma.js";
import type { ProductQueryDTO, productDTO } from "../dto/product.dto.js";
import { PrismaClient } from "@prisma/client";
import { Helper } from "../helper/helper.js";
import { NotificationService } from "./notification.service.js";
import type { WebsocketService } from "../socket/socket.js";

const helper = new Helper();


export class ProductService {
  private prisma: PrismaClient; // ← 필드 선언
  private notificationService: NotificationService;
  private wss: WebsocketService;
  constructor(prismaClient: PrismaClient, wss: WebsocketService) {
    this.prisma = prismaClient; //  ← 생성자에서 초기화
    this.notificationService = new NotificationService(prisma);
    this.wss = wss;
  }

  async accessListProduct(query: ProductQueryDTO) {
    const { page, take, name, description, keyword } = query;
    const skip = (page - 1) * take;
    const whereCondition = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : {};

    const products = await prisma.product.findMany({
      skip,
      take,
      where: whereCondition,
      include: {
        productTags: {
          include: {
            tag: true,
          },
        },
        comment: true,
      },
    });
    const result = products.map((p) => ({
      ...p,
      tags: p.productTags.map((pt) => pt.tag),
      comments: p.comment,
    }));
    return result;
  }

  async accessProduct(id: number) {
    const result = await helper.findProductById(id);

    if (!result) throw new Error("해당 아이템이 존재 하지않습니다.");
    return result;
  }

  async createProduct(userId: number, element: productDTO) {
    const { name, description, price, ownerId, productTags } = element;

    const data: any = {
      name,
      description,
      price,
      ownerId: userId,
    };

    if (productTags && productTags.length > 0) {
      data.productTags = {
        create: productTags.map((tagId) => ({
          tag: { connect: { id: tagId } }, // 단순 tagId 연결
        })),
      };
      const productData = await prisma.product.create({
        data,
      });
      return productData;
    }
  }

  async modifyProduct(userId: number, element: productDTO) {
    const { id, name, description, price, ownerId, productTags } = element;

    const idNum = Number(id);
    if(!idNum) throw new Error("product id is required")
    const product = await helper.findProductById(idNum);
    if (!product) throw new Error("해당 제품은 존재 하지않습니다");

    if (product.ownerId !== userId) {
      throw new Error("Unathorized");
    }

    const oldProduct = await prisma.product.findUnique({
      where: { id: idNum },
    });

    const data: any = {
      name,
      description,
      price,
      ownerId: userId,
      productTags: productTags?.length
      ?{ create: productTags.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
        : undefined,
    };

    if (!id) throw new Error("product id is required");
    const updated = await prisma.product.update({
      where: { id: idNum },
      data: { name, description, price, ownerId },
    });
    if (!oldProduct) throw new Error("해당 제품이 존재 하지 않습니다");
    if (oldProduct?.price !== updated.price) {
      const likers = await prisma.like.findMany({
        where: { productId: updated.id },
        select: { userId: true },
      });

      for (const liker of likers) {
        if (liker.userId !== userId) {
            await this.notificationService.createAndGenerate(
              userId,
              liker.userId,
              `가격 변경 알림`,
              "UNREAD",
              "CHANGED_PRICE",
              undefined,
              updated.id,
              undefined,
              oldProduct.price,
              updated.price
            );

          return updated;
          }
      }
    }

    const result = await prisma.product.update({
      where: { id },
      data,
    });
    return result;
  }

  async deleteProduct(id: number, userId: number) {
    const product = await helper.findProductById(id);
    if (!product) throw new Error("해당 제품은 존재 하지않습니다.");

    if (product.ownerId !== userId) {
      throw new Error("Unathorized");
    }
    const result = await prisma.product.delete({
      where: { id },
    });
    return result;
  }
}
