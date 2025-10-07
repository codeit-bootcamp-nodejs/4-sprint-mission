import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import {
  type IComment,
  type IOwner,
  type IProductTag,
  ProuductService,
} from "./product.service.js";
import type { NextFunction, Request, Response } from "express";
import HttpError from "../lib/error.js";

export interface ValidatedRequest extends Request {
  validatedParams?: RequestParams;
  validatedBody?: RequestBody;
  validatedQuery?: RequestQuery;
}

export interface RequestQuery {
    page: number;
    take: number;
    keyword: string;
  };
export interface RequestBody {
  name: string;
  description: string | null;
  price: number;
  productTags: IProductTag[];
  comment?: IComment[];
  ownerId: number;
}

export interface RequestParams {
  id: number;
}
const ProuductInstance = new ProuductService();
export class ProductController {
  async getProductListCont(query: RequestQuery, res: Response, next: NextFunction) {
    try {
      console.log("요청이 들어옴")
      const { page, take, keyword } = query;
      const skip = (page - 1) * take;
      if (skip < 0 && skip > 100) throw new HttpError(400, "skip 범위 오류");
      const ProductList = ProuductInstance.getProductList( { keyword, take, skip });
      return res.json({ success: true, data: ProductList });
    } catch (error) {
      next(error);
    }
  }

  async getProductCont(
    params: RequestParams,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productId = params.id;
      const Item = await ProuductInstance.getProduct({ id: productId });
      return res.json({ success: true, data: Item });
    } catch (error) {
      next(error);
    }
  }

  async createProductCont(
    req: Request<{}, {}, RequestBody, {}>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { name, description, price, productTags } = req.body;
      const ownerId = req.user?.id

      if (!ownerId) throw new HttpError(401, "Unauthorized")
      const newProduct = await ProuductInstance.createdProduct({
        input: {
          name,
          description,
          price,
          productTags,
          ownerId
        },
      });

      return res.json({ success: true, data: newProduct });
    } catch (error) {
      console.error(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") console.log("2025 에러발생");
      } else if (error instanceof Error) {
        console.log("general error", error.message);
      }
      next(error);
    }
  }

  async modifiedProductCont(
    params: RequestParams,
    body: RequestBody,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productId = params.id;
      const { name, description, price, productTags } = body;
      const uniqueProduct = await ProuductInstance.getProduct({
        id: productId,
      });
      if (!uniqueProduct) throw new HttpError(404, "not found");
      const updatatedData = await ProuductInstance.modifiedProduct({
        input: { id: productId, name, description, price, productTags },
      });
      return res.json({ success: true, data: updatatedData });
    } catch (error) {
      next(error);
    }
  }

  async poppedProductCont(
    params: RequestParams,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productId = params.id;
      await ProuductInstance.deletedProduct({ id: productId });
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
