
import HttpError from "../lib/error.js";
import prisma from"../lib/prisma.js";

export interface IProduct {
  id: number;
  name: string | null;
  description: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  productTags: IProductTag[];
  comments: IComment[];
  owner?: IOwner;
}
export interface IComment {
  id: number;
  title: string | null;
  type?: string | null;
  content: string | null;
  user?: IOwner;
  product?: IProduct;
}

export interface IOwner {
  id: number;
  nickname: string | null;
}

export interface IProductTag {
  tagId: number;
  productId: number;
}

export interface ITag {
  id: number;
  name: string;
}

export interface InputProuduct {
    take: number;
    skip: number;
    keyword?:string
}
export interface InputCreateProduct {
  name: string | null;
  description: string | null;
  price: number;
  productTags:IProductTag[];
  ownerId : number
}

export interface OutputCreateProduct {
  name: string | null;
  description: string | null;
  price: number;
  productTags:IProductTag[];
  ownerId : number
}
export interface InputUpdatedProduct{
  id : number;
  name?: string | null;
  description?: string | null;
  price?: number;
  productTags:IProductTag[];
}
export interface OutputUpdatedProduct{
  id: number;
  name?: string | null;
  description?: string | null;
  price?: number;
  productTags:IProductTag[];
  comments : IComment[]
}

export class ProuductService {
  async getProductList(
   input: InputProuduct
  ): Promise<IProduct[]> {
    const { take, skip } = input;
    const whereCondition = input.keyword
      ? {
          OR: [
            { name: { contains: input.keyword } },
            { description: { contains: input.keyword } },
          ],
        }
      : {};
    const ProductList = await prisma.product.findMany({
      take,
      skip,
      where: whereCondition,
      include: { productTags: true, comments: true, owner: true },
    });
    return ProductList;
  }
  async getProduct({ id }:{id:number}): Promise<IProduct> {
    const uniqueProduct = await prisma.product.findUnique({
      where: { id },
      include: { productTags: true, comments: true, owner: true },
    });
    if (!uniqueProduct) throw { status: 404, message: "invalid product" };
    return uniqueProduct;
  }

  async createdProduct({ input }: { input:InputCreateProduct }): Promise<OutputCreateProduct> {

    const { name, description, price, productTags , ownerId} = input;
    //console.log("name:",name,"description", description,"price", price,"productTags", productTags , "ownerid",ownerId)
      //console.log("ownerid type:",typeof ownerId)
    const user = await prisma.user.findUnique({
      where:{id : ownerId}
    })
    console.log("User found:", user);
    if(!user) throw new HttpError(404, "User not found")
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        owner: { connect: { id: ownerId } },
        productTags: { create: productTags },
      },
      include: {
        productTags: true,
        comments: true,
        owner: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return newProduct;
  }
  async modifiedProduct({input}:{input: InputUpdatedProduct}): Promise<OutputUpdatedProduct> {
    const productId = input.id;
    const newTagIds = input.productTags??[];
    //console.log("newTagIds:", newTagIds)
    const uniqueProduct = await prisma.product.findUnique({
      where: { id:productId },
      include: {
        productTags: true,
        comments: true,
        owner: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    if (!uniqueProduct) throw new HttpError(404, "invalid product" );
    await prisma.$transaction(async (tx) => {
      await tx.productTag.deleteMany({
        where: {productId },
      });
       await Promise.all(
        newTagIds.map(({ tagId }) =>
          tx.productTag.upsert({
            where: { productId_tagId: { productId, tagId } },
            create: { productId, tagId },
            update: {},
          })
        )
      );
    });
    const updatatedData = await prisma.product.update({
      where: { id: productId },  
      data: {
        name: input.name ??null,
        description: input.description?? null,
        price: input.price !,
      },
      include: {
        productTags: true,
        comments: true,
        owner: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return updatatedData
  }

  async deletedProduct ({id}: {id:number}):Promise<void>{
   const uniqueProduct = await this.getProduct({id});
   if (!uniqueProduct) throw new HttpError(404,"invalid product");
    await prisma.product.delete({
      where:{id}
    })
  }
}
