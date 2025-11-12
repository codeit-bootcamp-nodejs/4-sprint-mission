import type { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/product.service.js";
import type {ProductQueryDTO} from "../dto/product.dto.js"
import prisma from "../lib/prisma.js";
import type { Comment, ProductTag } from "@prisma/client";
import { Server as HttpServer } from "http";
import { WebsocketService } from "../socket/socket.js";

export class ProductController {
  private productService: ProductService;
  private wss : WebsocketService
  constructor(server: HttpServer) {
    this.wss = new WebsocketService(server)
    this.productService = new ProductService(prisma, this.wss);
    
  }
  async accessListProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams: ProductQueryDTO = req.query as unknown as ProductQueryDTO;
      const result = await this.productService.accessListProduct(queryParams)
      res.status(200).json({  data:result })
    } catch (error) {
      next(error)
    }
  }


  async accessProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idNum = Number(id)
      const result = await this.productService.accessProduct(idNum)
      res.status(200).json({ data:result })

    } catch (error) {
      next(error)
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, price, ownerId, productTags } = req.body as {
          name: string,
          description:string,
          price: number,
          ownerId:number,
          productTags: { id:number,productId: number,tagId: number }[];
        }
        const user = req.user
        if(!user) throw new Error("unathorized")
        const userId = user.id
        if(!userId) throw new Error("unathorized")
        const tagIds = productTags.map(pt => pt.tagId);
        const result = await this.productService.createProduct(userId,{ name, description, price, ownerId, productTags:tagIds })
        res.status(200).json({ data:result })
    } catch (error) {
      next(error)
    }
  }


  async modifyProduct(req: Request, res: Response, next: NextFunction) {
    try {

        const { id } =req.params// productId
        const { name, description, price, ownerId, productTags } = req.body as {
          name: string,
          description:string,
          price: number,
          ownerId:number,
          productTags: { id:number,productId: number,tagId: number }[];
        }

        const user = req.user
        if(!user) throw new Error("unathorized")
        const userId = user.id
        if(!userId) throw new Error("unathorized")
        const tagIds = productTags.map(pt => pt.tagId);
        const result = await this.productService.modifyProduct(userId,{ id: Number(id),name, description, price, ownerId, productTags:tagIds })
        res.status(200).json({ data:result })
    } catch (error) {
      next(error)
    }
  }


  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      //const user = req.user;
      //if(!user) throw new Error("unathorized");
      const {id} = req.params;
      const productId = Number(id);

      const userId = Number(req.user?.id)
      if(!userId) throw new Error("unathorized")
      
      const result = await this.productService.deleteProduct(productId, userId)
      return result;
    } catch (error) {
      next(error)
    }
  }
}
