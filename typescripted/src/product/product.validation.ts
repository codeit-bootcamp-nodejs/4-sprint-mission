import { Request, Response, NextFunction } from "express"
import {z} from "zod"
import { ValidatedRequest } from "../middleware/validateReq"

export class ValidateProduct{
    // zod schema
    static productTagSchema = z.object({
        id :z.coerce.number().min(0, {message:"인덱스는 0 이상이어야 합니다"}),
        name:z.string().min(2, {message:"제품 제목 2자 이상"}),

    })
    private static productParamsSchema =z.object({
       id: z.coerce.number().min(0,{message:"제품 인덱스는 0 이상"})
    })

    private static productQuerySchema = z.object({
        page: z.string().optional().transform(val => val ? Number(val) : 1),
        take: z.string().optional().transform(val => val ? Number(val) : 10),
        keyword: z.string().min(1,{message:"keywod  2자 이상"},).optional()
    })

    private static productBodySchema = z.object({
        name:z.string().min(2, {message:"제품 제목 2자 이상"}),
        description:z.string().min(10, {message:"제품 설명란 10자 이상"}).nullable(),
        price:z.string().regex(/^\d+$/).min(1000,{message:"제품 가격 1000원 이상"}),
        productTags: z.array(this.productTagSchema),
        ownerId: z.number(),  // owner 전체 말고 그냥 id만 받음
    })
    // validate 
    static validateBody = (
        req: ValidatedRequest,
        _res: Response,
        next: NextFunction
    ) =>{
        try {
           const result = this.productBodySchema.parse(req.body);
           req.validatedBody = result;
           console.log("req.validatedBody: ",  req.validatedBody)
           next(result)
        } catch (error) {
            next(error)
        }
    }
    static validateQuery = (req:ValidatedRequest, _res: Response, next:NextFunction)=>{
        try {
            const result = this.productQuerySchema.parse(req.query);
            req.validatedQuery = result;
            console.log("validated Query: ",  req.validatedQuery)
            next()
        } catch (error) {
            next(error)
        }
    }
    static validateParams = (req:ValidatedRequest, _res: Response, next:NextFunction) =>{
        try {
            const result = this.productParamsSchema.parse(req.params);
            req.validatedParams = result// parse qs
            next()
        } catch (error) {
            next(error)
        }
    }
}