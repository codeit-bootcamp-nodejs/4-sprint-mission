import prisma from "../../lib/prisma.js";

export class ProductService {
  
  async createProduct({ name, description, tags, price }) {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        include: {
          tags: true,
          comment: true,
          user: {
            select: { id: true, nickname: true },
          },
        },
      },
    });
    return newProduct;
  }
  async getProductList({ page, take, name, description, keyword }) {
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
      include: { tags: true, comment: true },
    });
    return products.map((p) => ({
      name: p.name,
      description: p.description,
      createdAt: p.createdAt,
      price: p.price,
      tags: p.tags,
      comment: p.comment,
    }));
  }

  async getProduct({ productId }) {
    const existProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        tags: true,
        comment: true,
        user: { select: { nickname: true } },
      },
    })
    if (!existProduct) throw { status: 404, message: "존재하지 않는 상품입니다." };

    return {
      name: existProduct.name,
      description: existProduct.description,
      createdAt: existProduct.createdAt,
      price: existProduct.price,
      tags: existProduct.tags,
      comment: existProduct.comment,
      user :existProduct.user
    };
  }

  async deleteProduct(productId) {
    await this.getProduct({productId})
    return await prisma.product.delete({ where: { id: productId } });
  }

  async modifiedProduct({ productId, data }) {
    const newTagIds = data.tags;
    await this.getProduct({ productId }); // 존재 여부 확인
    await prisma.$transaction(async (tx) => {
      await tx.productTag.deleteMany({
        where: {
          id: productId,
        },
      }),
        await Promise.all(
          newTagIds.map((tagId) =>
            tx.productTag.connectOrCreate({
              where: {
                productId_tagId: { productId, tagId },
              },
              create: { productId, tagId },
            })
          )
        );
      return await tx.product.update({
        where: { id: productId },
        data: {
          tags: {
          deleteMany: {}, // 기존 연결 제거
          connectOrCreate: newTagIds.map(tagId => ({
            where: { productId_tagId: { productId, tagId } },
            create: { productId, tagId },
          })),
        },
        name: data.name,
        price: data.price,
        },
      });
    });
  }
}
